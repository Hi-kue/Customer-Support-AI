# OpenAI Response Format

## Purpose of the Document

This markdown file is intended to provide a general overview of the typical response format for OpenAI models. 

> **NOTE**: The response format may vary depending on the specific OpenAI model and API implementation you are looking to integrate in your application.

As a general guideline, **ALL** openAI models will return a JSON object with the following keys:
- `choices`
- `message`
  - `content`
  - `role`
- `created`
- `id`
- `model`
- `object`
- `usage`
  - `completion_tokens`
  - `prompt_tokens`
  - `total_tokens`

## Example Response

Here is an example response for a typical OpenAI model that is considered as "Chat Completions" response format:
```json
{
  "choices": [
    {
      "finish_reason": "stop",
      "index": 0,
      "message": {
        "content": "The 2020 World Series was played in Texas at Globe Life Field in Arlington.",
        "role": "assistant"
      },
      "logprobs": null
    }
  ],
  "created": 1677664795,
  "id": "chatcmpl-7QyqpwdfhqwajicIEznoc6Q47XAyW",
  "model": "gpt-4o-mini",
  "object": "chat.completion",
  "usage": {
    "completion_tokens": 17,
    "prompt_tokens": 57,
    "total_tokens": 74
  }
}
```

> **NOTE**: To get the response from the AI, you can extract it using the following: `message = completion.choices[0].message.content`.