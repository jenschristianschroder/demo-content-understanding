@description('Azure region')
param location string

@description('Application name prefix')
param appName string

@description('Container Apps Environment ID')
param environmentId string

@description('User-assigned managed identity ID')
param identityId string

@description('ACR login server')
param acrLoginServer string

@description('Image tag')
param imageTag string

@description('Internal API backend URL')
param apiBackendUrl string

resource spa 'Microsoft.App/containerApps@2023-05-01' = {
  name: '${appName}-spa'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identityId}': {} }
  }
  properties: {
    managedEnvironmentId: environmentId
    configuration: {
      ingress: {
        external: true
        targetPort: 80
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
          name: 'spa'
          image: '${acrLoginServer}/${appName}-spa:${imageTag}'
          resources: { cpu: json('0.25'), memory: '0.5Gi' }
          env: [
            { name: 'API_BACKEND_URL', value: apiBackendUrl }
          ]
        }
      ]
      scale: { minReplicas: 1, maxReplicas: 2 }
    }
  }
}

output url string = 'https://${spa.properties.configuration.ingress.fqdn}'
