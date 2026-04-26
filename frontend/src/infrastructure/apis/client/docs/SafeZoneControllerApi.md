# SafeZoneControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**checkGeofence**](SafeZoneControllerApi.md#checkgeofence) | **POST** /api/v1/pets/{petId}/safe-zones/check |  |
| [**createSafeZone**](SafeZoneControllerApi.md#createsafezone) | **POST** /api/v1/pets/{petId}/safe-zones |  |
| [**deleteSafeZone**](SafeZoneControllerApi.md#deletesafezone) | **DELETE** /api/v1/pets/{petId}/safe-zones/{zoneId} |  |
| [**getSafeZoneById1**](SafeZoneControllerApi.md#getsafezonebyid1) | **GET** /api/v1/pets/{petId}/safe-zones/{zoneId} |  |
| [**getSafeZones1**](SafeZoneControllerApi.md#getsafezones1) | **GET** /api/v1/pets/{petId}/safe-zones |  |
| [**updateSafeZone**](SafeZoneControllerApi.md#updatesafezone) | **PUT** /api/v1/pets/{petId}/safe-zones/{zoneId} |  |



## checkGeofence

> GeofenceCheckResponseDto checkGeofence(petId, geofenceCheckRequestDto)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { CheckGeofenceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
    // GeofenceCheckRequestDto
    geofenceCheckRequestDto: ...,
  } satisfies CheckGeofenceRequest;

  try {
    const data = await api.checkGeofence(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |
| **geofenceCheckRequestDto** | [GeofenceCheckRequestDto](GeofenceCheckRequestDto.md) |  | |

### Return type

[**GeofenceCheckResponseDto**](GeofenceCheckResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## createSafeZone

> SafeZoneResponseDto createSafeZone(petId, safeZoneRequestDto)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { CreateSafeZoneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
    // SafeZoneRequestDto
    safeZoneRequestDto: ...,
  } satisfies CreateSafeZoneRequest;

  try {
    const data = await api.createSafeZone(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |
| **safeZoneRequestDto** | [SafeZoneRequestDto](SafeZoneRequestDto.md) |  | |

### Return type

[**SafeZoneResponseDto**](SafeZoneResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## deleteSafeZone

> ApiResponseDto deleteSafeZone(petId, zoneId)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { DeleteSafeZoneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
    // number
    zoneId: 789,
  } satisfies DeleteSafeZoneRequest;

  try {
    const data = await api.deleteSafeZone(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**ApiResponseDto**](ApiResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSafeZoneById1

> SafeZoneResponseDto getSafeZoneById1(petId, zoneId)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { GetSafeZoneById1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
    // number
    zoneId: 789,
  } satisfies GetSafeZoneById1Request;

  try {
    const data = await api.getSafeZoneById1(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**SafeZoneResponseDto**](SafeZoneResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## getSafeZones1

> Array&lt;SafeZoneResponseDto&gt; getSafeZones1(petId)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { GetSafeZones1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetSafeZones1Request;

  try {
    const data = await api.getSafeZones1(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**Array&lt;SafeZoneResponseDto&gt;**](SafeZoneResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: Not defined
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)


## updateSafeZone

> SafeZoneResponseDto updateSafeZone(petId, zoneId, safeZoneRequestDto)



### Example

```ts
import {
  Configuration,
  SafeZoneControllerApi,
} from '';
import type { UpdateSafeZoneRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SafeZoneControllerApi(config);

  const body = {
    // number
    petId: 789,
    // number
    zoneId: 789,
    // SafeZoneRequestDto
    safeZoneRequestDto: ...,
  } satisfies UpdateSafeZoneRequest;

  try {
    const data = await api.updateSafeZone(body);
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters


| Name | Type | Description  | Notes |
|------------- | ------------- | ------------- | -------------|
| **petId** | `number` |  | [Defaults to `undefined`] |
| **zoneId** | `number` |  | [Defaults to `undefined`] |
| **safeZoneRequestDto** | [SafeZoneRequestDto](SafeZoneRequestDto.md) |  | |

### Return type

[**SafeZoneResponseDto**](SafeZoneResponseDto.md)

### Authorization

[BearerAuth](../README.md#BearerAuth)

### HTTP request headers

- **Content-Type**: `application/json`
- **Accept**: `*/*`


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
| **200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#api-endpoints) [[Back to Model list]](../README.md#models) [[Back to README]](../README.md)

