
# GeofenceCheckResponseDto


## Properties

Name | Type
------------ | -------------
`petId` | number
`petName` | string
`latitude` | number
`longitude` | number
`insideSafeZone` | boolean
`safeZoneName` | string
`message` | string

## Example

```typescript
import type { GeofenceCheckResponseDto } from ''

// TODO: Update the object below with actual values
const example = {
  "petId": null,
  "petName": null,
  "latitude": null,
  "longitude": null,
  "insideSafeZone": null,
  "safeZoneName": null,
  "message": null,
} satisfies GeofenceCheckResponseDto

console.log(example)

// Convert the instance to a JSON string
const exampleJSON: string = JSON.stringify(example)
console.log(exampleJSON)

// Parse the JSON string back to an object
const exampleParsed = JSON.parse(exampleJSON) as GeofenceCheckResponseDto
console.log(exampleParsed)
```

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


