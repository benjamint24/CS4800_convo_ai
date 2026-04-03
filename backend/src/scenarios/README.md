# ConvoAI Scenarios: System Prompt Management

This directory contains the structured system prompt templates and utilities for generating AI conversation scenarios.

## Overview

The scenario system provides:
- **Structured templates** with clear sections and documented rationale
- **Version control** for tracking prompt iterations
- **Variable configuration** for customization (learner level, region, tone)
- **Reusable utilities** for rendering prompts consistently

## Directory Structure

```
scenarios/
├── promptBuilder.js              # Main utility for building prompts
├── restaurantPrompt.js           # Legacy static prompt (for reference)
├── templates/
│   └── restaurant.template.js   # Structured restaurant waiter template
└── README.md                     # This file
```

## Quick Start

### Basic Usage (Default Settings)

```javascript
const { buildRestaurantPrompt } = require('./scenarios/promptBuilder');

// Generate prompt with defaults (intermediate, Spain Spanish, standard tone)
const promptData = buildRestaurantPrompt();

console.log(promptData.prompt);   // The system prompt string
console.log(promptData.version);  // Template version (e.g., "1.0.0")
console.log(promptData.config);   // Configuration used
```

### Customized for Beginner Learner

```javascript
const promptData = buildRestaurantPrompt({
  learnerLevel: 'beginner',
  region: 'latinAmerica',
  tone: 'casual'
});

// Use in AI service
const { sendChatRequest } = require('../services/ai.service');

const result = await sendChatRequest({
  systemPrompt: promptData.prompt,
  messages: [
    { role: 'user', content: 'Hola' }
  ]
});
```

### With Custom Instructions

```javascript
const promptData = buildRestaurantPrompt({
  learnerLevel: 'intermediate',
  customInstructions: 'Focus on vegetarian menu options and emphasize healthy choices.'
});
```

## Configuration Options

### Learner Level

Controls vocabulary complexity, sentence structure, and response style.

| Level | Description | Use When |
|-------|-------------|----------|
| `beginner` | Simple vocabulary, basic tenses, short clear sentences | User has basic Spanish knowledge |
| `intermediate` | Natural conversational Spanish, mixed tenses | User can hold basic conversations (default) |
| `advanced` | Rich vocabulary, complex structures, idioms | User is near-fluent |

**Example:**
```javascript
buildRestaurantPrompt({ learnerLevel: 'beginner' });
```

### Region

Controls dialect, pronoun forms, and regional expressions.

| Region | Description | Characteristics |
|--------|-------------|-----------------|
| `spain` | Castilian Spanish | Uses 'vosotros', expressions like 'vale', 'genial' (default) |
| `latinAmerica` | Neutral Latin American | Uses 'ustedes', neutral vocabulary |
| `mexico` | Mexican Spanish | Uses 'ustedes', Mexican expressions like 'órale' |

**Example:**
```javascript
buildRestaurantPrompt({ region: 'mexico' });
```

### Tone

Controls formality level and service style.

| Tone | Description | Characteristics |
|------|-------------|-----------------|
| `casual` | Friendly neighborhood restaurant | Uses 'tú', relaxed expressions |
| `standard` | Professional but approachable | Uses 'tú', balanced service (default) |
| `formal` | Upscale fine dining | Uses 'usted', refined language |

**Example:**
```javascript
buildRestaurantPrompt({ tone: 'formal' });
```

### Custom Instructions

Add specific guidance for particular use cases.

**Example:**
```javascript
buildRestaurantPrompt({
  customInstructions: 'Today focus on seafood dishes and wine pairings.'
});
```

## API Reference

### `buildRestaurantPrompt(options)`

Builds a restaurant waiter system prompt with optional configuration.

**Parameters:**
- `options` (Object, optional):
  - `learnerLevel` (string): `'beginner'`, `'intermediate'`, or `'advanced'`
  - `region` (string): `'spain'`, `'latinAmerica'`, or `'mexico'`
  - `tone` (string): `'casual'`, `'standard'`, or `'formal'`
  - `customInstructions` (string): Additional instructions to append

**Returns:** Object with:
- `prompt` (string): The complete system prompt
- `version` (string): Template version used
- `config` (Object): Configuration applied
- `metadata` (Object): Additional template metadata

**Throws:** Error if invalid configuration values provided

### `getLegacyPrompt()`

Returns the original static prompt for comparison or fallback.

**Returns:** string - The legacy prompt

### `getAvailableOptions()`

Lists all available configuration options with descriptions.

**Returns:** Object with arrays of available options for each config type

**Example:**
```javascript
const { getAvailableOptions } = require('./scenarios/promptBuilder');

const options = getAvailableOptions();
console.log(options.learnerLevels);  // Array of learner level options
console.log(options.regions);        // Array of region options
console.log(options.tones);          // Array of tone options
```

### `getTemplateMetadata()`

Returns template version, status, and changelog.

**Returns:** Object with metadata

## Template Structure

The restaurant template (`templates/restaurant.template.js`) is organized into sections:

1. **Metadata & Versioning** - Version info, changelog, status
2. **Core Role Definition** - Who the AI is, primary goal, context
3. **Hard Rules** - Absolute constraints (language, boundaries, safety)
4. **Style Guidelines** - Best practices (tone, regional variants)
5. **Context & Assumptions** - Setting info, what AI knows
6. **Conversation Patterns** - Flow guidelines, follow-up strategies
7. **Fallback Behaviors** - How to handle edge cases

Each section has a documented purpose and rationale.

## Usage in Controllers

### Example: Chat Controller

```javascript
const { buildRestaurantPrompt } = require('../scenarios/promptBuilder');
const { sendChatRequest } = require('../services/ai.service');

async function handleChatMessage(req, res) {
  try {
    const { message, history = [], learnerLevel = 'intermediate' } = req.body;
    
    // Build prompt based on user's learner level
    const promptData = buildRestaurantPrompt({
      learnerLevel,
      region: 'spain'  // Could be from user profile
    });
    
    // Prepare conversation history
    const messages = [
      ...history,
      { role: 'user', content: message }
    ];
    
    // Call AI service
    const result = await sendChatRequest({
      systemPrompt: promptData.prompt,
      messages,
      config: {
        temperature: 0.7,
        maxTokens: 512
      }
    });
    
    res.json({
      response: result.response,
      model: result.model,
      promptVersion: promptData.version
    });
    
  } catch (error) {
    res.status(error.statusCode || 500).json({
      error: error.code,
      message: error.message
    });
  }
}
```

## Testing Prompts

### Manual Testing Checklist

Before validating a prompt version, test:

1. **Happy path:**
   - Customer greets → orders food → orders drink → closes
   
2. **Edge cases:**
   - Customer speaks English
   - Customer asks off-topic question
   - Customer asks grammar question
   - Customer gives minimal responses ("sí", "no")
   
3. **Role adherence:**
   - AI stays in waiter character
   - AI doesn't become a teacher
   - AI responds only in Spanish
   
4. **Consistency:**
   - Same input produces similar responses
   - Multi-turn context is maintained
   
5. **Configuration:**
   - Beginner vs advanced differences clear
   - Regional variants work as expected
   - Tone adjustments are noticeable

### Test Scripts

Save test scenarios in `Project Documents/prompt-testing-v{version}.md`

Format:
```markdown
# Prompt Testing - Version 1.0.0

## Test Case 1: Basic Ordering Flow
- **Config:** Default (intermediate, Spain)
- **Input:** "Hola, quisiera ordenar."
- **Expected:** Greeting + offer help or ask question
- **Actual:** [Record actual response]
- **Pass/Fail:** Pass
- **Notes:** Response was natural and in character

[Continue for all test cases...]
```

## Versioning

### Version Number Format

`MAJOR.MINOR.PATCH`

- **MAJOR:** Significant behavior changes (breaking changes)
- **MINOR:** New features or sections (backward compatible)
- **PATCH:** Bug fixes or clarifications (small improvements)

### When to Increment Versions

- **PATCH (1.0.0 → 1.0.1):**
  - Fix typos or clarify ambiguous instructions
  - Minor wording improvements
  - No behavior change expected

- **MINOR (1.0.0 → 1.1.0):**
  - Add new configuration option (e.g., new region)
  - Add new section to template
  - Enhance existing guidelines
  - Backward compatible

- **MAJOR (1.0.0 → 2.0.0):**
  - Restructure template format
  - Remove or fundamentally change sections
  - Change hard rules significantly
  - May break existing behavior

### Changelog

Update `metadata.changelog` in template file for each version:

```javascript
changelog: [
  {
    version: '1.1.0',
    date: '2026-03-15',
    changes: 'Added fallback for customer confusion',
    improvements: 'Better handling of unclear requests'
  },
  {
    version: '1.0.0',
    date: '2026-03-09',
    changes: 'Initial structured template',
    improvements: 'Converted from static prompt'
  }
]
```

## Adding New Scenarios

To create a new scenario (e.g., "hotel-check-in"):

1. **Create template file:**
   ```
   templates/hotel.template.js
   ```

2. **Follow template structure:**
   - Copy restaurant.template.js structure
   - Update role, rules, context for hotel scenario
   - Add scenario-specific sections

3. **Add builder function:**
   ```javascript
   // In promptBuilder.js
   function buildHotelPrompt(options = {}) {
     const hotelTemplate = require('./templates/hotel.template');
     // Similar logic to buildRestaurantPrompt
   }
   ```

4. **Document:**
   - Update this README with new scenario
   - Create testing guidelines
   - Document configuration options

5. **Test:**
   - Run manual testing checklist
   - Compare with existing scenarios
   - Get team approval

## Best Practices

### For Developers

1. **Always use builder, never hardcode prompts**
   ```javascript
   // ✅ Good
   const { buildRestaurantPrompt } = require('./scenarios/promptBuilder');
   const promptData = buildRestaurantPrompt();
   
   // ❌ Bad
   const prompt = "You are a waiter...";
   ```

2. **Version prompts used in production**
   - Log prompt version with each AI call
   - Helps debug behavior changes
   - Enables A/B testing

3. **Test prompt changes thoroughly**
   - Use testing checklist
   - Compare to previous version
   - Get team review before deploying

4. **Document why, not just what**
   - When updating template, explain rationale
   - Add notes about observed behaviors
   - Link to testing results

### For Prompt Engineers

1. **Keep sections focused**
   - Each section has one clear purpose
   - Avoid redundancy between sections
   - No contradictory instructions

2. **Use specific examples**
   - Show desired behavior with examples
   - Use counter-examples for what to avoid
   - Make expectations concrete

3. **Test incrementally**
   - Change one thing at a time
   - Measure impact before next change
   - Keep working versions as checkpoints

4. **Balance flexibility and control**
   - Hard rules for critical constraints
   - Guidelines for preferred patterns
   - Leave room for natural variation

## Troubleshooting

### Prompt too long?

- Current template is ~800-1000 words
- If AI context window is limited, consider:
  - Removing advanced level adjustments
  - Simplifying style guidelines
  - Condensing fallback examples

### AI not following instructions?

1. Check hard rules are clear and specific
2. Verify no contradictory instructions
3. Test if model limitation (not prompt issue)
4. Consider adding few-shot examples
5. Increase specificity of guidance

### Inconsistent behavior?

1. Check temperature setting (lower = more consistent)
2. Verify prompt hasn't changed between calls
3. Test if input variations cause inconsistency
4. Consider adding more explicit constraints

### Configuration not working?

1. Verify configuration values are valid
2. Check logs for which prompt was actually used
3. Test each config option independently
4. Ensure template sections exist for that config

## Future Enhancements

Planned improvements:

- [ ] Add few-shot example system
- [ ] Support multi-language scenarios (English, French, etc.)
- [ ] Add conversation history truncation guidance
- [ ] Create prompt testing automation
- [ ] Add A/B testing utilities
- [ ] Support dynamic menu items from database
- [ ] Add more granular regional variants
- [ ] Create prompt analytics dashboard

## Related Documentation

- [AI Service Wrapper](../README.md#ai-service-wrapper) - How to use prompts with AI service
- [Task 2.4.4 Plan](../../../agent/2_4_4_plan.md) - Original planning document
- [Prompt Design Rationale](../../../Project Documents/prompt-design-rationale.md) - Design decisions

## Support

For questions or issues:
1. Check this README first
2. Review template comments
3. Check prompt testing docs
4. Ask team in #convoai-backend channel

---

**Last Updated:** 2026-03-09  
**Current Template Version:** 1.0.0 (Draft)  
**Maintainers:** ConvoAI Team
