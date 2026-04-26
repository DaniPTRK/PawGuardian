# SpeciesControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**addSpecies**](SpeciesControllerApi.md#addspecies) | **POST** /api/v1/species |  |
| [**deleteSpecies**](SpeciesControllerApi.md#deletespecies) | **DELETE** /api/v1/species/{speciesId} |  |
| [**getAllSpecies**](SpeciesControllerApi.md#getallspecies) | **GET** /api/v1/species |  |



## addSpecies

> PetSpecies addSpecies(speciesRequestDto)



### Example

```ts
import {
  Configuration,
  SpeciesControllerApi,
} from '';
import type { AddSpeciesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SpeciesControllerApi(config);

  const body = {
    // SpeciesRequestDto
    speciesRequestDto: ...,
  } satisfies AddSpeciesRequest;

  try {
    const data = await api.addSpecies(body);
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
| **speciesRequestDto** | [SpeciesRequestDto](SpeciesRequestDto.md) |  | |

### Return type

[**PetSpecies**](PetSpecies.md)

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


## deleteSpecies

> ApiResponseDto deleteSpecies(speciesId)



### Example

```ts
import {
  Configuration,
  SpeciesControllerApi,
} from '';
import type { DeleteSpeciesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SpeciesControllerApi(config);

  const body = {
    // number
    speciesId: 56,
  } satisfies DeleteSpeciesRequest;

  try {
    const data = await api.deleteSpecies(body);
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
| **speciesId** | `number` |  | [Defaults to `undefined`] |

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


## getAllSpecies

> Array&lt;PetSpecies&gt; getAllSpecies()



### Example

```ts
import {
  Configuration,
  SpeciesControllerApi,
} from '';
import type { GetAllSpeciesRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new SpeciesControllerApi(config);

  try {
    const data = await api.getAllSpecies();
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

[**Array&lt;PetSpecies&gt;**](PetSpecies.md)

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

