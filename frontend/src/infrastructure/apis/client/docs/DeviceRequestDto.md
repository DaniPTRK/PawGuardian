
# DeviceRequestDto


## Properties

Name | Type
------------ | -------------
`serialNumber` | string
`model` | string
`petId` | number

## Example

```typescript
import type { DeviceRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "serialNumber": null,
  "model": null,
  "petId": null,
} satisfies DeviceRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as DeviceRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


