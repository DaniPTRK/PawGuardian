
# FeedbackRequestDto


## Properties

Name | Type
------------ | -------------
`category` | string
`rating` | number
`wouldRecommend` | string
`mailAccuracyGood` | boolean
`experienceFriendly` | boolean
`vetSatisfied` | boolean
`message` | string

## Example

```typescript
import type { FeedbackRequestDto } from ''

// TODO: Update the object below with actual values
const example = {
  "category": null,
  "rating": null,
  "wouldRecommend": null,
  "mailAccuracyGood": null,
  "experienceFriendly": null,
  "vetSatisfied": null,
  "message": null,
} satisfies FeedbackRequestDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as FeedbackRequestDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


