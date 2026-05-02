# FeedbackControllerApi

All URIs are relative to *http://localhost:8090*

| Method | HTTP request | Description |
|------------- | ------------- | -------------|
| [**deleteFeedback**](FeedbackControllerApi.md#deletefeedback) | **DELETE** /api/v1/feedback/{id} |  |
| [**getAllFeedback**](FeedbackControllerApi.md#getallfeedback) | **GET** /api/v1/feedback |  |
| [**getFeedbackById**](FeedbackControllerApi.md#getfeedbackbyid) | **GET** /api/v1/feedback/{id} |  |
| [**submitFeedback**](FeedbackControllerApi.md#submitfeedback) | **POST** /api/v1/feedback |  |



## deleteFeedback

> ApiResponseDto deleteFeedback(id)



### Example

```ts
import {
  Configuration,
  FeedbackControllerApi,
} from '';
import type { DeleteFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FeedbackControllerApi(config);

  const body = {
    // number
    id: 789,
  } satisfies DeleteFeedbackRequest;

  try {
    const data = await api.deleteFeedback(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

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


## getAllFeedback

> Array&lt;FeedbackResponseDto&gt; getAllFeedback()



### Example

```ts
import {
  Configuration,
  FeedbackControllerApi,
} from '';
import type { GetAllFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FeedbackControllerApi(config);

  try {
    const data = await api.getAllFeedback();
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

[**Array&lt;FeedbackResponseDto&gt;**](FeedbackResponseDto.md)

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


## getFeedbackById

> FeedbackResponseDto getFeedbackById(id)



### Example

```ts
import {
  Configuration,
  FeedbackControllerApi,
} from '';
import type { GetFeedbackByIdRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FeedbackControllerApi(config);

  const body = {
    // number
    id: 789,
  } satisfies GetFeedbackByIdRequest;

  try {
    const data = await api.getFeedbackById(body);
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
| **id** | `number` |  | [Defaults to `undefined`] |

### Return type

[**FeedbackResponseDto**](FeedbackResponseDto.md)

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


## submitFeedback

> FeedbackResponseDto submitFeedback(feedbackRequestDto)



### Example

```ts
import {
  Configuration,
  FeedbackControllerApi,
} from '';
import type { SubmitFeedbackRequest } from '';

async function example() {
  console.log("🚀 Testing  SDK...");
  const config = new Configuration({ 
    // Configure HTTP bearer authorization: BearerAuth
    accessToken: "YOUR BEARER TOKEN",
  });
  const api = new FeedbackControllerApi(config);

  const body = {
    // FeedbackRequestDto
    feedbackRequestDto: ...,
  } satisfies SubmitFeedbackRequest;

  try {
    const data = await api.submitFeedback(body);
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
| **feedbackRequestDto** | [FeedbackRequestDto](FeedbackRequestDto.md) |  | |

### Return type

[**FeedbackResponseDto**](FeedbackResponseDto.md)

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

