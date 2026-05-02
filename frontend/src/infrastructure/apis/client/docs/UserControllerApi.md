# UserControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**assignPetToVet**](UserControllerApi.md#assignpettovet) | **POST** /api/v1/users/{vetId}/assign-pet/{petId} |  |
| [**deleteMyAccount**](UserControllerApi.md#deletemyaccount) | **DELETE** /api/v1/users/me |  |
| [**deleteUserById**](UserControllerApi.md#deleteuserbyid) | **DELETE** /api/v1/users/{userId} |  |
| [**getAllUsers**](UserControllerApi.md#getallusers) | **GET** /api/v1/users |  |
| [**getAllVets**](UserControllerApi.md#getallvets) | **GET** /api/v1/users/vets |  |
| [**getMyPatients1**](UserControllerApi.md#getmypatients1) | **GET** /api/v1/users/vet/patients |  |
| [**getMyProfile**](UserControllerApi.md#getmyprofile) | **GET** /api/v1/users/me |  |
| [**getUserById**](UserControllerApi.md#getuserbyid) | **GET** /api/v1/users/{userId} |  |
| [**promoteToRole**](UserControllerApi.md#promotetorole) | **POST** /api/v1/users/{userId}/promote/{role} |  |
| [**removePetFromVet**](UserControllerApi.md#removepetfromvet) | **DELETE** /api/v1/users/{vetId}/assign-pet/{petId} |  |
| [**removeRole**](UserControllerApi.md#removerole) | **DELETE** /api/v1/users/{userId}/role/{role} |  |
| [**updateMyProfile**](UserControllerApi.md#updatemyprofile) | **PUT** /api/v1/users/me |  |
| [**updateUserById**](UserControllerApi.md#updateuserbyid) | **PUT** /api/v1/users/{userId} |  |



## assignPetToVet

> ApiResponseDto assignPetToVet(vetId, petId)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { AssignPetToVetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    vetId: 789,
    // number
    petId: 789,
  } satisfies AssignPetToVetRequest;

  try {
    const data = await api.assignPetToVet(body);
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
| **vetId** | `number` |  | [Defaults to `undefined`] |
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


## deleteMyAccount

> ApiResponseDto deleteMyAccount()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { DeleteMyAccountRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  try {
    const data = await api.deleteMyAccount();
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


## deleteUserById

> ApiResponseDto deleteUserById(userId)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { DeleteUserByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    userId: 789,
  } satisfies DeleteUserByIdRequest;

  try {
    const data = await api.deleteUserById(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |

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


## getAllUsers

> Array&lt;UserResponseDto&gt; getAllUsers()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetAllUsersRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  try {
    const data = await api.getAllUsers();
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


## getAllVets

> Array&lt;UserResponseDto&gt; getAllVets()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetAllVetsRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  try {
    const data = await api.getAllVets();
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


## getMyPatients1

> Array&lt;PetResponseDto&gt; getMyPatients1()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetMyPatients1Request } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  try {
    const data = await api.getMyPatients1();
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


## getMyProfile

> UserResponseDto getMyProfile()



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetMyProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  try {
    const data = await api.getMyProfile();
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

[**UserResponseDto**](UserResponseDto.md)

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


## getUserById

> UserResponseDto getUserById(userId)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { GetUserByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    userId: 789,
  } satisfies GetUserByIdRequest;

  try {
    const data = await api.getUserById(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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


## promoteToRole

> UserResponseDto promoteToRole(userId, role)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { PromoteToRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    userId: 789,
    // string
    role: role_example,
  } satisfies PromoteToRoleRequest;

  try {
    const data = await api.promoteToRole(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |
| **role** | `string` |  | [Defaults to `undefined`] |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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


## removePetFromVet

> ApiResponseDto removePetFromVet(vetId, petId)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { RemovePetFromVetRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    vetId: 789,
    // number
    petId: 789,
  } satisfies RemovePetFromVetRequest;

  try {
    const data = await api.removePetFromVet(body);
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
| **vetId** | `number` |  | [Defaults to `undefined`] |
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


## removeRole

> UserResponseDto removeRole(userId, role)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { RemoveRoleRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    userId: 789,
    // string
    role: role_example,
  } satisfies RemoveRoleRequest;

  try {
    const data = await api.removeRole(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |
| **role** | `string` |  | [Defaults to `undefined`] |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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


## updateMyProfile

> UserResponseDto updateMyProfile(updateUserDto)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { UpdateMyProfileRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // UpdateUserDto
    updateUserDto: ...,
  } satisfies UpdateMyProfileRequest;

  try {
    const data = await api.updateMyProfile(body);
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
| **updateUserDto** | [UpdateUserDto](UpdateUserDto.md) |  | |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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


## updateUserById

> UserResponseDto updateUserById(userId, updateUserDto)



### Example

```ts
import {
  Configuration,
  UserControllerApi,
} from '';
import type { UpdateUserByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new UserControllerApi(config);

  const body = {
    // number
    userId: 789,
    // UpdateUserDto
    updateUserDto: ...,
  } satisfies UpdateUserByIdRequest;

  try {
    const data = await api.updateUserById(body);
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
| **userId** | `number` |  | [Defaults to `undefined`] |
| **updateUserDto** | [UpdateUserDto](UpdateUserDto.md) |  | |

### Return type

[**UserResponseDto**](UserResponseDto.md)

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

