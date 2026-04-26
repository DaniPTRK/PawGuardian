# DeviceControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**getDeviceForPet**](DeviceControllerApi.md#getdeviceforpet) | **GET** /api/v1/devices/pet/{petId} |  |
| [**getMyDevices**](DeviceControllerApi.md#getmydevices) | **GET** /api/v1/devices/my-devices |  |
| [**registerDevice**](DeviceControllerApi.md#registerdevice) | **POST** /api/v1/devices |  |
| [**removeDevice**](DeviceControllerApi.md#removedevice) | **DELETE** /api/v1/devices/pet/{petId} |  |



## getDeviceForPet

> DeviceResponseDto getDeviceForPet(petId)



### Example

```ts
import {
  Configuration,
  DeviceControllerApi,
} from '';
import type { GetDeviceForPetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DeviceControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetDeviceForPetRequest;

  try {
    const data = await api.getDeviceForPet(body);
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

[**DeviceResponseDto**](DeviceResponseDto.md)

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


## getMyDevices

> Array&lt;DeviceResponseDto&gt; getMyDevices()



### Example

```ts
import {
  Configuration,
  DeviceControllerApi,
} from '';
import type { GetMyDevicesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DeviceControllerApi(config);

  try {
    const data = await api.getMyDevices();
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

[**Array&lt;DeviceResponseDto&gt;**](DeviceResponseDto.md)

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


## registerDevice

> DeviceResponseDto registerDevice(deviceRequestDto)



### Example

```ts
import {
  Configuration,
  DeviceControllerApi,
} from '';
import type { RegisterDeviceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DeviceControllerApi(config);

  const body = {
    // DeviceRequestDto
    deviceRequestDto: ...,
  } satisfies RegisterDeviceRequest;

  try {
    const data = await api.registerDevice(body);
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
| **deviceRequestDto** | [DeviceRequestDto](DeviceRequestDto.md) |  | |

### Return type

[**DeviceResponseDto**](DeviceResponseDto.md)

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


## removeDevice

> ApiResponseDto removeDevice(petId)



### Example

```ts
import {
  Configuration,
  DeviceControllerApi,
} from '';
import type { RemoveDeviceRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new DeviceControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies RemoveDeviceRequest;

  try {
    const data = await api.removeDevice(body);
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

