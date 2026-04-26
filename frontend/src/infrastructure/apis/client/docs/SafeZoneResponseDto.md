
# SafeZoneResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`zoneName` | string
`active` | boolean
`petId` | number
`vertices` | [Array&lt;SafeZoneVertexDto&gt;](SafeZoneVertexDto.md)

## Example

```typescript
import type { SafeZoneResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "zoneName": null,
  "active": null,
  "petId": null,
  "vertices": null,
} satisfies SafeZoneResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SafeZoneResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


