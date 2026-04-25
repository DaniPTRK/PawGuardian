# VetControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getCurrentStatus**](VetControllerApi.md#getcurrentstatus) | **GET** /api/v1/vet/patients/{petId}/health/current |  |
| [**getHealthHistory**](VetControllerApi.md#gethealthhistory) | **GET** /api/v1/vet/patients/{petId}/health/history |  |
| [**getMyPatients**](VetControllerApi.md#getmypatients) | **GET** /api/v1/vet/patients |  |
| [**getPatientById**](VetControllerApi.md#getpatientbyid) | **GET** /api/v1/vet/patients/{petId} |  |
| [**getSafeZoneById**](VetControllerApi.md#getsafezonebyid) | **GET** /api/v1/vet/patients/{petId}/safe-zones/{zoneId} |  |
| [**getSafeZones**](VetControllerApi.md#getsafezones) | **GET** /api/v1/vet/patients/{petId}/safe-zones |  |



## getCurrentStatus

> HealthMetricDto getCurrentStatus(petId)



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetCurrentStatusRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetCurrentStatusRequest;

  try {
    const data = await api.getCurrentStatus(body);
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

[**HealthMetricDto**](HealthMetricDto.md)

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


## getHealthHistory

> Array&lt;HealthMetricDto&gt; getHealthHistory(petId)



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetHealthHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetHealthHistoryRequest;

  try {
    const data = await api.getHealthHistory(body);
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

[**Array&lt;HealthMetricDto&gt;**](HealthMetricDto.md)

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


## getMyPatients

> Array&lt;PetResponseDto&gt; getMyPatients()



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetMyPatientsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  try {
    const data = await api.getMyPatients();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

// Run the test
example().catch(console.error);
```

### Parameters

This endpoint does not need any parameter.

### Return type

[**Array&lt;PetResponseDto&gt;**](PetResponseDto.md)

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


## getPatientById

> PetResponseDto getPatientById(petId)



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetPatientByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetPatientByIdRequest;

  try {
    const data = await api.getPatientById(body);
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

[**PetResponseDto**](PetResponseDto.md)

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


## getSafeZoneById

> SafeZoneResponseDto getSafeZoneById(petId, zoneId)



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetSafeZoneByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  const body = {
    // number
    petId: 789,
    // number
    zoneId: 789,
  } satisfies GetSafeZoneByIdRequest;

  try {
    const data = await api.getSafeZoneById(body);
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


## getSafeZones

> Array&lt;SafeZoneResponseDto&gt; getSafeZones(petId)



### Example

```ts
import {
  Configuration,
  VetControllerApi,
} from '';
import type { GetSafeZonesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new VetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetSafeZonesRequest;

  try {
    const data = await api.getSafeZones(body);
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

