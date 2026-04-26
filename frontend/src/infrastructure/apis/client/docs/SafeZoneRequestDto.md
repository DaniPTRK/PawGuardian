
# SafeZoneRequestDto


## Properties

Name | Type
------------ | -------------
`zoneName` | string
`active` | boolean
`vertices` | [Array&lt;SafeZoneVertexDto&gt;](SafeZoneVertexDto.md)

## Example

```typescript
import type { SafeZoneRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "zoneName": null,
  "active": null,
  "vertices": null,
} satisfies SafeZoneRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as SafeZoneRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


