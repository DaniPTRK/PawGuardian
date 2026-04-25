# PetControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addPet**](PetControllerApi.md#addpet) | **POST** /api/v1/pets |  |
| [**deletePet**](PetControllerApi.md#deletepet) | **DELETE** /api/v1/pets/{petId} |  |
| [**getAssignedVets**](PetControllerApi.md#getassignedvets) | **GET** /api/v1/pets/{petId}/vets |  |
| [**getMyPets**](PetControllerApi.md#getmypets) | **GET** /api/v1/pets/my-pets |  |
| [**getPetById**](PetControllerApi.md#getpetbyid) | **GET** /api/v1/pets/{petId} |  |
| [**updatePet**](PetControllerApi.md#updatepet) | **PUT** /api/v1/pets/{petId} |  |



## addPet

> PetResponseDto addPet(petRequestDto)



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { AddPetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  const body = {
    // PetRequestDto
    petRequestDto: ...,
  } satisfies AddPetRequest;

  try {
    const data = await api.addPet(body);
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
| **petRequestDto** | [PetRequestDto](PetRequestDto.md) |  | |

### Return type

[**PetResponseDto**](PetResponseDto.md)

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


## deletePet

> ApiResponseDto deletePet(petId)



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { DeletePetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies DeletePetRequest;

  try {
    const data = await api.deletePet(body);
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


## getAssignedVets

> Array&lt;UserResponseDto&gt; getAssignedVets(petId)



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { GetAssignedVetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetAssignedVetsRequest;

  try {
    const data = await api.getAssignedVets(body);
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

[**Array&lt;UserResponseDto&gt;**](UserResponseDto.md)

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


## getMyPets

> Array&lt;PetResponseDto&gt; getMyPets()



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { GetMyPetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  try {
    const data = await api.getMyPets();
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


## getPetById

> PetResponseDto getPetById(petId)



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { GetPetByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  const body = {
    // number
    petId: 789,
  } satisfies GetPetByIdRequest;

  try {
    const data = await api.getPetById(body);
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


## updatePet

> PetResponseDto updatePet(petId, petRequestDto)



### Example

```ts
import {
  Configuration,
  PetControllerApi,
} from '';
import type { UpdatePetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new PetControllerApi(config);

  const body = {
    // number
    petId: 789,
    // PetRequestDto
    petRequestDto: ...,
  } satisfies UpdatePetRequest;

  try {
    const data = await api.updatePet(body);
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
| **petRequestDto** | [PetRequestDto](PetRequestDto.md) |  | |

### Return type

[**PetResponseDto**](PetResponseDto.md)

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

