
# ApiResponseDto


## Properties

Name | Type
------------ | -------------
`statusCode` | number
`message` | string
`timestamp` | Date

## Example

```typescript
import type { ApiResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "statusCode": null,
  "message": null,
  "timestamp": null,
} satisfies ApiResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as ApiResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


