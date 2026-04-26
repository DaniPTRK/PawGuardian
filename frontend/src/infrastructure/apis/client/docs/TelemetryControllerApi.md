# TelemetryControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getCurrentStatus1**](TelemetryControllerApi.md#getcurrentstatus1) | **GET** /api/v1/telemetry/{petId}/current |  |
| [**getHistory**](TelemetryControllerApi.md#gethistory) | **GET** /api/v1/telemetry/{petId}/history |  |
| [**recordTelemetry**](TelemetryControllerApi.md#recordtelemetry) | **POST** /api/v1/telemetry/record |  |



## getCurrentStatus1

> HealthMetricDto getCurrentStatus1(petId)



### Example

```ts
import {
  Configuration,
  TelemetryControllerApi,
} from '';
import type { GetCurrentStatus1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TelemetryControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetCurrentStatus1Request;

  try {
    const data = await api.getCurrentStatus1(body);
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


## getHistory

> Array&lt;HealthMetricDto&gt; getHistory(petId)



### Example

```ts
import {
  Configuration,
  TelemetryControllerApi,
} from '';
import type { GetHistoryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TelemetryControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetHistoryRequest;

  try {
    const data = await api.getHistory(body);
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


## recordTelemetry

> ApiResponseDto recordTelemetry(healthMetricDto)



### Example

```ts
import {
  Configuration,
  TelemetryControllerApi,
} from '';
import type { RecordTelemetryRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new TelemetryControllerApi(config);

  const body = {
    // HealthMetricDto
    healthMetricDto: ...,
  } satisfies RecordTelemetryRequest;

  try {
    const data = await api.recordTelemetry(body);
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
| **healthMetricDto** | [HealthMetricDto](HealthMetricDto.md) |  | |

### Return type

[**ApiResponseDto**](ApiResponseDto.md)

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

