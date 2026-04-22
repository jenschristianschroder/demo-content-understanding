@description('Azure region')
param location string

@description('Application name prefix')
param appName string

@description('Container Apps Environment ID')
param environmentId string

@description('User-assigned managed identity ID')
param identityId string

@description('Managed identity client ID')
param identityClientId string

@description('ACR login server')
param acrLoginServer string

@description('Image tag')
param imageTag string

resource api 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${appName}-api'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identityId}': {} }
  }
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      ingress: {
        external: false
        targetPort: 3001
        transport: 'http'
      }
      registries: [
        {
          server: acrLoginServer
          identity: identityId
        }
      ]
    }
    template: {
      containers: [
        {
          name: 'api'
          image: '${acrLoginServer}/${appName}-api:${imageTag}'
          resources: { cpu: json('0.5'), memory: '1Gi' }
          env: [
            { name: 'PORT', value: '3001' }
            { name: 'AZURE_CLIENT_ID', value: identityClientId }
            { name: 'AZURE_CONTENT_UNDERSTANDING_ENDPOINT', value: '' }  // Set after deployment
            { name: 'AZURE_CONTENT_UNDERSTANDING_REGION', value: '' }
            { name: 'CORS_ORIGIN', value: '*' }
          ]
          probes: [
            { type: 'Startup', httpGet: { path: '/health/startup', port: 3001 }, initialDelaySeconds: 5, periodSeconds: 5 }
            { type: 'Liveness', httpGet: { path: '/health/live', port: 3001 }, periodSeconds: 30 }
            { type: 'Readiness', httpGet: { path: '/health/ready', port: 3001 }, periodSeconds: 10 }
          ]
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 2 }
    }
  }
}

output fqdn string = api.properties.configuration.ingress.fqdn
