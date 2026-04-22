@description('Azure region')
param location string

@description('Application name prefix')
param appName string

@description('AI Services resource ID for RBAC')
param aiServicesResourceId string

@description('ACR resource ID for AcrPull')
param acrId string

resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${appName}-identity'
  location: location
}

// Cognitive Services User role on AI Services resource
resource cogServicesRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(identity.id, aiServicesResourceId, 'CognitiveServicesUser')
  scope: resourceGroup()
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', 'a97b65f3-24c7-4388-baec-2e87135dc908')
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// AcrPull role on Container Registry
resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(identity.id, acrId, 'AcrPull')
  scope: resourceGroup()
  properties: {
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d')
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

output identityId string = identity.id
output identityClientId string = identity.properties.clientId
