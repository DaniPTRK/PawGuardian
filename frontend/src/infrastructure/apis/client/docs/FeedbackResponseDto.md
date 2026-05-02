
# FeedbackResponseDto


## Properties

Name | Type
------------ | -------------
`id` | number
`userEmail` | string
`category` | string
`rating` | number
`subscribe` | boolean
`message` | string
`createdAt` | Date

## Example

```typescript
import type { FeedbackResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "userEmail": null,
  "category": null,
  "rating": null,
  "subscribe": null,
  "message": null,
  "createdAt": null,
} satisfies FeedbackResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FeedbackResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


