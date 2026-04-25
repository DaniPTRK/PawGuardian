
# HealthMetricDto


## Properties

Name | Type
------------ | -------------
`id` | number
`petId` | number
`latitude` | number
`longitude` | number
`heartRate` | number
`temperature` | number
`batteryLevel` | number
`timestamp` | Date

## Example

```typescript
import type { HealthMetricDto } from ''

// TODO: Update the object below with actual values
const example = {
  "id": null,
  "petId": null,
  "latitude": null,
  "longitude": null,
  "heartRate": null,
  "temperature": null,
  "batteryLevel": null,
  "timestamp": null,
} satisfies HealthMetricDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as HealthMetricDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


