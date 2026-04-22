@description('Azure region')
param location string

@description('Application name prefix')
param appName string

var acrName = '${replace(appName, '-', '')}${uniqueString(resourceGroup().id)}'

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false }
}

output acrId string = acr.id
output acrLoginServer string = acr.properties.loginServer
