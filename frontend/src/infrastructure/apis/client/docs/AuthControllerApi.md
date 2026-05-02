# AuthControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**login**](AuthControllerApi.md#login) | **POST** /api/v1/auth/login |  |
| [**register**](AuthControllerApi.md#register) | **POST** /api/v1/auth/register |  |
| [**validateToken**](AuthControllerApi.md#validatetoken) | **GET** /api/v1/auth/token |  |



## login

> LoginResponseDto login(loginDto)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { LoginRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthControllerApi(config);

  const body = {
    // LoginDto
    loginDto: ...,
  } satisfies LoginRequest;

  try {
    const data = await api.login(body);
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
| **loginDto** | [LoginDto](LoginDto.md) |  | |

### Return type

[**LoginResponseDto**](LoginResponseDto.md)

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


## register

> LoginResponseDto register(registerDto)



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { RegisterRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthControllerApi(config);

  const body = {
    // RegisterDto
    registerDto: ...,
  } satisfies RegisterRequest;

  try {
    const data = await api.register(body);
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
| **registerDto** | [RegisterDto](RegisterDto.md) |  | |

### Return type

[**LoginResponseDto**](LoginResponseDto.md)

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


## validateToken

> ApiResponseDto validateToken()



### Example

```ts
import {
  Configuration,
  AuthControllerApi,
} from '';
import type { ValidateTokenRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new AuthControllerApi(config);

  try {
    const data = await api.validateToken();
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

