
# PetResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`name` | string
`species` | string
`breed` | string
`age` | number
`ownerEmail` | string
`assignedVetIds` | Set&lt;number&gt;

## Example

```typescript
import type { PetResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "name": null,
  "species": null,
  "breed": null,
  "age": null,
  "ownerEmail": null,
  "assignedVetIds": null,
} satisfies PetResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as PetResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


