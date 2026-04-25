
# DeviceResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`serialNumber` | string
`model` | string
`batteryLevel` | number
`petId` | number
`petName` | string

## Example

```typescript
import type { DeviceResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "serialNumber": null,
  "model": null,
  "batteryLevel": null,
  "petId": null,
  "petName": null,
} satisfies DeviceResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeviceResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


