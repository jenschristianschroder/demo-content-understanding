// ---------------------------------------------------------------------------
// Main Bicep orchestrator for Content Understanding demo
// Mirrors the reference speech-service repo deployment pattern
// ---------------------------------------------------------------------------

@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Application name prefix')
param appName string = 'content-understanding'

@description('Azure AI Services resource ID (for RBAC)')
param aiServicesResourceId string

@description('Container image tag')
param imageTag string = 'latest'

@description('Azure Content Understanding endpoint URL')
param contentUnderstandingEndpoint string

// --- Modules ---

module acr 'modules/acr.bicep' = {
  name: 'acr'
  params: {
    location: location
    appName: appName
  }
}

module environment 'modules/aca-environment.bicep' = {
  name: 'aca-environment'
  params: {
    location: location
    appName: appName
  }
}

module identity 'modules/identity.bicep' = {
  name: 'identity'
  params: {
    location: location
    appName: appName
    aiServicesResourceId: aiServicesResourceId
    acrId: acr.outputs.acrId
  }
}

module api 'modules/aca-api.bicep' = {
  name: 'aca-api'
  params: {
    location: location
    appName: appName
    environmentId: environment.outputs.environmentId
    identityId: identity.outputs.identityId
    identityClientId: identity.outputs.identityClientId
    acrLoginServer: acr.outputs.acrLoginServer
    imageTag: imageTag
    contentUnderstandingEndpoint: contentUnderstandingEndpoint
  }
}

module spa 'modules/aca-spa.bicep' = {
  name: 'aca-spa'
  params: {
    location: location
    appName: appName
    environmentId: environment.outputs.environmentId
    identityId: identity.outputs.identityId
    acrLoginServer: acr.outputs.acrLoginServer
    imageTag: imageTag
    apiBackendUrl: 'http://${api.outputs.fqdn}'
  }
}

// --- Outputs ---

output spaUrl string = spa.outputs.url
output acrLoginServer string = acr.outputs.acrLoginServer
