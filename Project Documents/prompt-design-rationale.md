# Prompt Design Rationale: Restaurant Waiter Scenario

**Task:** 2.4.4 - Design System Prompt Template for Restaurant Scenario  
**Version:** 1.0.0 (Draft)  
**Date:** March 9, 2026  
**Author:** ConvoAI Team  
**Status:** Draft (Pending Testing)

## Executive Summary

This document explains the design decisions, trade-offs, and rationale behind the structured restaurant waiter prompt template system created for ConvoAI.

**Key Changes from Original:**
- Static prompt → Structured, versioned template system
- Single configuration → Variable options (learner level, region, tone)
- Implicit rules → Explicit, documented guidelines
- No version control → Full versioning with changelog
- Limited edge case handling → Comprehensive fallback behaviors

**Expected Benefits:**
- Improved consistency and predictability
- Easier maintenance and iteration
- Supports different learner levels
- Better edge case handling
- Clear team understanding of prompt logic

## Design Goals

### Primary Goals

1. **Consistency:** Produce reliable, predictable AI behavior across conversations
2. **Maintainability:** Enable team to understand, update, and improve prompts over time
3. **Extensibility:** Support variations (beginner vs advanced, regional differences)
4. **Clarity:** Every instruction has a documented purpose and rationale
5. **Testability:** Structure enables systematic testing and validation

### Secondary Goals

6. **Role Adherence:** AI stays in waiter character, never becomes a teacher
7. **Language Enforcement:** Spanish-only responses, even when customer uses English
8. **Natural Conversation:** Avoid robotic or overly formal responses
9. **Learning Support:** Authentic practice without explicit grammar correction
10. **Safety:** Handle inappropriate input gracefully and professionally

## Architecture Decisions

### Decision 1: Structured Template vs Static String

**Options Considered:**
- A) Keep static string prompt (current approach)
- B) Create structured template with sections
- C) Use external configuration file (YAML/JSON)

**Decision:** Option B - Structured template with sections

**Rationale:**
- **Pro:** Each section has clear purpose and can be documented
- **Pro:** Easier to update specific parts without affecting others
- **Pro:** Supports variable composition (include/exclude sections based on config)
- **Pro:** Code-based (benefits from version control, IDE support)
- **Con:** More complex than static string
- **Con:** Requires builder utility to assemble

**Why Not A (Static String):**
- Difficult to maintain as requirements grow
- No clear organization or documentation
- Can't easily support variations
- Hard to test specific behaviors in isolation

**Why Not C (External Config):**
- Adds dependency on file parsing
- Less IDE support (no autocomplete, syntax highlighting)
- More difficult to keep in sync with code
- Overkill for current needs

### Decision 2: Versioning System

**Options Considered:**
- A) No versioning (always use latest)
- B) Git-based versioning only
- C) Embedded version metadata in template
- D) Separate version registry/database

**Decision:** Option C - Embedded version metadata

**Rationale:**
- **Pro:** Version travels with template code
- **Pro:** Easy to log which version was used in AI calls
- **Pro:** Supports A/B testing of prompt versions
- **Pro:** Changelog documents evolution
- **Con:** Requires discipline to update version numbers
- **Con:** Manual version tracking (not automated)

**Why Not A (No Versioning):**
- Can't debug behavior changes over time
- Can't track which prompt produced which behavior
- Can't A/B test improvements
- Difficult to rollback if changes hurt quality

**Why Not B (Git Only):**
- Version not easily accessible at runtime
- Can't log prompt version with AI responses
- Harder to coordinate with deployment tracking

**Why Not D (Database):**
- Over-engineered for current needs
- Adds infrastructure complexity
- Unnecessary unless managing many scenarios

### Decision 3: Variable Configuration System

**Options Considered:**
- A) Single prompt fits all learners
- B) Separate templates per learner level
- C) Variable sections composed based on config
- D) Runtime string replacement with placeholders

**Decision:** Option C - Variable sections composed based on config

**Rationale:**
- **Pro:** DRY - shared sections used across variations
- **Pro:** Supports multiple dimensions (level, region, tone)
- **Pro:** Easy to add new variations
- **Pro:** Clear what changes between configurations
- **Con:** More complex builder logic
- **Con:** Need to avoid conflicting instructions

**Why Not A (Single Prompt):**
- Beginners and advanced learners have different needs
- One size fits all produces suboptimal results for both groups
- Regional differences (Spain vs LATAM) are significant
- Formality level matters for different contexts

**Why Not B (Separate Templates):**
- Massive duplication (most content is shared)
- Difficult to keep consistent across templates
- Changes require updating multiple files
- Scales poorly (3 levels × 3 regions × 3 tones = 27 files)

**Why Not D (String Replacement):**
- Limited flexibility (only works for simple substitutions)
- Doesn't support structural variations
- Hard to validate result is coherent
- Makes template harder to read with {{placeholders}}

## Section-by-Section Rationale

### Metadata & Versioning

**Purpose:** Track template evolution and enable debugging/testing

**Why Included:**
- Need to know which prompt version produced which behavior
- Changelog helps team understand what changed and why
- Status field indicates testing state (draft/validated/deprecated)
- Enables A/B testing and gradual rollout

### Core Role Definition

**Purpose:** Establish AI's identity, goal, and context

**Design Choices:**

1. **Concrete persona ("Miguel, a waiter at Casa Española"):**
   - More effective than generic "You are a waiter"
   - Name and restaurant create mental anchor
   - Helps AI maintain consistent character

2. **Explicit primary goal:**
   - AI needs to know what "success" means
   - Separates role (waiter) from goal (successful dining experience)
   - Justifies specific behaviors (taking orders, answering questions)

3. **Learning context acknowledgment:**
   - AI knows customer is practicing Spanish
   - Explains why NOT to explicitly teach grammar
   - Balances authentic experience with learner needs
   - Critical for maintaining waiter role while supporting learning

4. **Persona traits:**
   - "Professional but warm" - prevents both cold and overly casual
   - "Patient with questions" - learner-appropriate
   - "Naturally conversational" - avoid robotic responses
   - Actionable characteristics that guide behavior

**What We Avoided:**
- ❌ Vague descriptors ("friendly") without context
- ❌ Overly detailed backstory (unnecessary, wastes tokens)
- ❌ Conflicting traits (formal yet super casual)

### Hard Rules

**Purpose:** Absolute constraints that must NEVER be violated

**Why "MUST FOLLOW" Language:**
- Distinguishes requirements from preferences
- Clear to AI that these are non-negotiable
- Team knows these are critical behaviors to test

**Language Rules:**

1. **Spanish-only response:**
   - Core to learning use case
   - "Even if customer writes in English" - prevents code-switching
   - Exception documented for explicit translation requests
   - **Why:** Without this, AI will switch to English if customer does

2. **Natural conversational Spanish:**
   - Prevents overly formal or academic tone
   - Contractions and colloquialisms appropriate
   - **Why:** Learners need exposure to real conversational patterns

**Role Boundaries:**

1. **Stay in waiter character:**
   - "Do not become a Spanish teacher" - critical distinction
   - "Model correct usage naturally" instead of explicit correction
   - **Why:** Breaking character ruins authentic experience
   - **Why natural modeling:** Learners hear correct forms without embarrassment

2. **Stay within restaurant context:**
   - Redirect off-topic questions
   - **Why:** Focus practice on relevant vocabulary domain
   - **Why redirect:** More natural than refusing to respond

**Response Constraints:**

1. **Keep responses brief (1-3 sentences):**
   - Matches typical waiter interaction length
   - Prevents overwhelming learner with text
   - **Why exception for menu descriptions:** Authentic and useful

2. **At most ONE follow-up question:**
   - Prevents interrogation feel
   - More natural conversation flow
   - **Why:** Multiple questions at once is cognitively demanding

3. **Never invent specific prices:**
   - Avoids creating false expectations
   - **Why:** This is practice, not real ordering
   - Allows general price discussion without commitment

**Safety Rules:**

1. **Handle inappropriate input professionally:**
   - One polite boundary setting
   - Then minimal engagement if continues
   - **Why:** Maintains character while protecting system

2. **Don't make promises about actual orders:**
   - Reminds that this is conversational practice
   - **Why:** Prevents confusion about real vs practice

### Style Guidelines

**Purpose:** Preferred patterns and best practices (not absolute requirements)

**Why "SHOULD FOLLOW" vs "MUST FOLLOW":**
- Allows natural variation in responses
- Guidelines, not rigid rules
- Gives AI some creative flexibility
- Balance between consistency and naturalness

**Tone Guidelines:**

1. **"Warm but professional":**
   - Sets emotional tone
   - "Smile through your words" - concrete way to achieve warmth
   - **Why:** Encourages learners, makes practice enjoyable

2. **Match customer's energy:**
   - Adaptive to different learner styles
   - Brief if they're brief, engaged if they're chatty
   - **Why:** Better learner experience, more natural

**Regional Variants:**

**Why Support Multiple Regions:**
- Spanish learners have different target dialects
- "Vosotros" (Spain) vs "ustedes" (LATAM) is fundamental
- Regional expressions add authenticity
- Learners often have specific goals (studying abroad in Spain vs working in Mexico)

**Why These Three Specifically:**
- **Spain:** Most common in European context, distinct vosotros form
- **Latin America (Neutral):** Broad applicability, professional safe choice
- **Mexico:** Largest Spanish speaking population, common learning target

**What We Avoided:**
- Too many regional variants (diminishing returns, maintenance burden)
- Mixing multiple regional styles in one conversation (confusing)
- Stereotypical or exaggerated regional slang

**Tone Variants:**

1. **Casual:** Neighborhood restaurant (tú, relaxed)
2. **Standard:** Professional but friendly (tú, default) 
3. **Formal:** Fine dining (usted, refined)

**Why Support Tone Variants:**
- Learners need practice with different formality levels
- Usted vs tú is important learning distinction
- Different real-world scenarios require different tones

### Context & Assumptions

**Purpose:** Establish shared understanding and implicit knowledge

**Setting Context:**
- Specific enough to be concrete (Casa Española)
- General enough to be flexible (no specific menu)
- **Why:** AI needs environmental context to respond naturally

**What AI Knows:**
- General Spanish cuisine (enables menu discussions)
- Common drinks (core to restaurant scenario)
- Service flow (greeting → order → serve → bill)
- **Why explicit:** Without this, AI might claim ignorance inappropriately

**What AI Doesn't Need to Know:**
- Specific prices (avoid false specificity)
- Exact wait times (can't commit to real timing)
- **Why explicit:** Prevents AI from inventing these details

**Customer Assumptions:**
- Language learner context
- May make mistakes
- Wants authentic interaction, not lesson
- **Why:** Explains behavior guidance (don't explicitly teach, model naturally)

### Conversation Patterns

**Purpose:** Guide natural conversation flow and follow-up strategies

**Why Included:**
- Provides structure for multi-turn conversations
- Models realistic restaurant interaction sequence
- Helps AI know when to ask what

**Flow Stages:**
1. Opening (greeting)
2. Taking order (acknowledgment before follow-up)
3. Clarifying (natural waiter questions)
4. Confirming (order summary)
5. Closing (farewell)

**Why This Structure:**
- Models real restaurant experience
- Gives learner complete scenario practice
- Creates natural conclusion point

**Follow-up Strategy:**
- Natural questions a waiter would ask
- Not forced if order seems complete
- Offer guidance if uncertainty detected
- **Why:** Balance between prompting conversation and not being pushy

**Response Length Targets:**
- Specific ranges for different turn types
- "Always prioritize clarity over brevity"
- **Why:** Guidance without strict enforcement, allows judgment

### Fallback Behaviors

**Purpose:** Handle edge cases and unexpected inputs gracefully

**Why Comprehensive Fallbacks:**
- Edge cases reveal prompt quality
- Learners will test boundaries (intentionally or not)
- Professional handling maintains character
- Prevents awkward or broken responses

**Key Fallbacks Documented:**

1. **English attempts:**
   - Don't comment on language switch (stay in character)
   - Respond naturally in Spanish
   - **Why:** Gentle Spanish enforcement without scolding
   - **Design choice:** Implicit vs explicit correction (implicit is more natural)

2. **Off-topic questions:**
   - Brief acknowledgment + redirect
   - Stay in waiter role during redirect
   - **Why:** Polite but firm boundary, maintains focus

3. **Grammar questions:**
   - Brief answer IN CHARACTER
   - "Soy camarero, no profesor" - reminds of role
   - Immediately return to waiter tasks
   - **Why:** Helpful but doesn't become teaching mode
   - **Design choice:** Could refuse entirely, but brief help is more natural

4. **Inappropriate input:**
   - ONE polite boundary
   - Minimal engagement if continues
   - **Why:** Professional handling without escalating

5. **Very short responses:**
   - Don't comment on brevity
   - Provide next clear option
   - **Why:** Some learners are shy or struggling, don't call attention to it

6. **Confusion:**
   - One specific clarifying question
   - Offer options to make easier
   - **Why:** Help without overwhelming

7. **Ending conversation:**
   - Order summary
   - Warm closing
   - Leave door open
   - **Why:** Natural conclusion, complete scenario

8. **Grammar mistakes:**
   - NEVER correct explicitly
   - Model correct form naturally in response
   - **Why:** Research shows natural modeling is more effective for acquisition
   - **Why:** Explicit correction breaks immersion and can discourage

**What We Avoided:**
- ❌ Overly complex fallback decision trees
- ❌ Breaking character to explain system behavior
- ❌ Apologizing excessively ("Sorry, I can't help with that")
- ❌ Judgmental responses to learner errors

## Learner Level Differentiation

**Why Support Different Levels:**
- Beginners need simpler input (vocabulary, grammar)
- Advanced learners benefit from rich, varied language
- Same response can be too complex for one, too simple for another

**Beginner Adjustments:**
- Simple common vocabulary only
- Short clear sentences
- Primarily present tense
- One question at a time
- Extra patience with pauses

**Why These Specific Changes:**
- Cognitive load management (beginners process slower)
- Builds confidence (comprehensible input)
- Encourages practice (not overwhelming)

**Intermediate Adjustments (Default):**
- Natural conversational vocabulary
- Mixed tenses naturally
- Normal flow

**Why This as Default:**
- Most learners are at intermediate level
- Good balance of challenge and accessibility
- Closest to authentic native speaker interaction

**Advanced Adjustments:**
- Rich varied vocabulary
- Full grammatical range
- Idiomatic expressions
- Can discuss complex topics

**Why These Changes:**
- Advanced learners benefit from exposure to full language
- Preparing for native-level interactions
- Can handle linguistic complexity

## Trade-offs and Limitations

### Trade-off 1: Prompt Length vs Context Window

**Issue:** Comprehensive template is ~800-1000 words

**Trade-off:** 
- ✅ Clear, complete instructions
- ❌ Uses more context window
- ❌ Leaves less room for conversation history

**Decision:** Prioritize clarity over brevity
- Context windows are growing (32k+ tokens)
- ~1000 words ≈ 1300 tokens (small fraction of available)
- Comprehensive instructions more important than saving tokens
- Can optimize later if context becomes constraint

**Mitigation if needed:**
- Remove redundant examples
- Condense style guidelines
- Move some content to few-shot examples instead

### Trade-off 2: Flexibility vs Consistency

**Issue:** More flexible prompts allow creativity, but risk inconsistency

**Trade-off:**
- ✅ "MUST FOLLOW" for critical behaviors (consistency)
- ✅ "SHOULD FOLLOW" for style (flexibility)
- ❌ Still some variation in interpretation

**Decision:** Balanced approach
- Hard rules for non-negotiable items
- Guidelines for preferred patterns
- Accept some natural variation
- Test to ensure variation is acceptable

**Mitigation:**
- Test extensively to find unacceptable variations
- Tighten rules if behavior too inconsistent
- Use temperature setting to control randomness at API level

### Trade-off 3: Explicitness vs Natural Language

**Issue:** Very explicit instructions can sound mechanical

**Trade-off:**
- ✅ Explicit = clear, testable, maintainable
- ❌ Risk of sounding like a checklist
- ❌ May feel less natural to AI

**Decision:** Explicit but with examples
- Use clear section headers and rules
- Provide concrete examples showing tone
- Balance structure with naturalistic guidance

**Mitigation:**
- Examples show desired tone
- "Conversational" emphasized in persona traits
- Test output for robotic vs natural feel

### Trade-off 4: Variable Complexity vs Maintainability

**Issue:** More variables = more combinations to test and maintain

**Trade-off:**
- ✅ Variables support different use cases (3 levels × 3 regions × 3 tones)
- ❌ 27 possible configurations to validate
- ❌ More complex builder logic

**Decision:** Start with current variables, expand carefully
- 3 dimensions is manageable
- Most combinations are sensible (can test subset)
- Proven need before adding more dimensions

**Mitigation:**
- Focus testing on common configurations
- Document which combinations are validated
- Add variables only when clear user need

## Alternative Approaches Considered

### Alternative 1: Few-Shot Examples Instead of Instructions

**Approach:** Provide example conversations showing desired behavior instead of explicit rules

**Pros:**
- Can be more natural and intuitive
- Shows rather than tells
- Some models learn better from examples

**Cons:**
- Requires more tokens (examples are long)
- Hard to cover all edge cases with examples
- Less explicit about specific constraints
- Can't easily version or track what changed

**Why Not Chosen:**
- Instruction-following models (like Mistral) work well with explicit guidance
- Easier to maintain and update explicit rules
- Can always add examples later if needed
- Examples can be in conversation history instead of system prompt

### Alternative 2: Separate Prompt for Each Scenario Stage

**Approach:** Different prompts for greeting, ordering, clarifying, closing stages

**Pros:**
- Each stage has focused, specific instructions
- Can optimize each stage independently
- Less cognitive load per prompt

**Cons:**
- Complex state management (which stage are we in?)
- Transitions between stages could be awkward
- More engineering complexity
- Harder to maintain consistency across stages

**Why Not Chosen:**
- Single prompt keeps it simple
- Waiter role is consistent throughout conversation
- Modern LLMs can handle comprehensive prompts
- Conversation flow should emerge naturally, not be forced into stages

### Alternative 3: Reinforcement Learning from Human Feedback

**Approach:** Use RLHF to train model behavior instead of prompt engineering

**Pros:**
- Can achieve very specific behaviors
- Doesn't require long prompts
- Potentially more natural responses

**Cons:**
- Requires training infrastructure
- Need large dataset of rated conversations
- Expensive and time-consuming
- Hard to update behavior quickly

**Why Not Chosen:**
- Out of scope for current project
- Prompt engineering is faster and more flexible
- Can iterate on prompts quickly
- Using pre-trained models is sufficient for MVP

## Lessons Learned

### From Original Static Prompt

**What Worked:**
- ✅ Simple role definition ("Spanish waiter")
- ✅ Explicit language constraint (Spanish only)
- ✅ Short response guidance
- ✅ Character consistency instruction

**What Needed Improvement:**
- ❌ No edge case handling
- ❌ No versioning or documentation
- ❌ Can't customize for different learners
- ❌ Vague terms ("friendly") without examples
- ❌ Missing context about learning use case

### During Design Process

**Key Insights:**
1. **Explicitness matters:** "Don't teach grammar" is clearer than "stay in role"
2. **Examples help:** Showing desired behavior reinforces instructions
3. **Negative constraints important:** "Don't do X" needed alongside "Do Y"
4. **Context shapes behavior:** Explaining customer is learner improves responses
5. **Structure aids maintenance:** Sections make it easy to update specific parts

**Challenges:**
1. **Balancing length:** Comprehensive vs concise is ongoing tension
2. **Avoiding contradictions:** Need to review cross-section consistency
3. **Testing effort:** More complex prompt = more test scenarios needed
4. **Team alignment:** Discussing specific wording takes time but is valuable

## Future Improvements

### Planned (Next Version)

1. **Add few-shot examples:**
   - 2-3 example exchanges in template
   - Show desired behavior concretely
   - Especially for edge cases

2. **Conversation history truncation guidance:**
   - How far back to include history
   - How to summarize older turns
   - Maintain context without token bloat

3. **Menu integration hooks:**
   - Support for actual menu items from database
   - Variables for today's specials
   - Real vs hypothetical menu handling

### Under Consideration

4. **More granular regional variants:**
   - Argentina (vos form)
   - Caribbean Spanish
   - Andean Spanish
   - Balance: value vs maintenance burden

5. **Dynamic difficulty adjustment:**
   - Real-time learner level adjustment
   - Based on error frequency or response patterns
   - Requires more sophisticated system

6. **Personality variations:**
   - Cheerful vs reserved variants
   - Chatty vs efficient variants
   - Match to learner preferences

7. **Multi-turn strategy guidance:**
   - Explicit conversation arc management
   - How to naturally close conversation
   - When to introduce new topics

### Research Needed

8. **Prompt compression techniques:**
   - Can we maintain quality with shorter prompts?
   - What's minimum effective length?
   - Test compressed versions

9. **A/B testing framework:**
   - Systematic comparison of prompt versions
   - Metrics for prompt quality
   - Automated quality scoring

10. **Cross-model testing:**
    - Does this prompt work well with other models?
    - Model-specific optimizations needed?
    - Fallback strategies for different providers

## Testing and Validation Plan

### Pre-Release Testing

**Required before marking version as "validated":**

1. **Happy path testing (5 scenarios):**
   - Greeting and ordering food
   - Asking about menu items
   - Ordering drinks
   - Requesting multiple items
   - Asking for bill

2. **Edge case testing (6 scenarios):**
   - Customer speaks English
   - Customer asks off-topic question
   - Customer asks grammar question
   - Customer gives very short responses
   - Customer makes grammar mistakes
   - Inappropriate input

3. **Configuration testing (6 scenarios):**
   - Beginner vs intermediate vs advanced
   - Spain vs Latin America vs Mexico
   - Casual vs standard vs formal

4. **Multi-turn testing (3 scenarios):**
   - 5+ turn conversation with order changes
   - Context retention check
   - Natural conversation flow

**Total:** 20 test scenarios minimum

### Success Criteria

**For version 1.0.0 to move from "draft" to "validated":**

- ✅ 18/20 test scenarios pass (90% threshold)
- ✅ Zero hard rule violations
- ✅ Team consensus on behavior quality
- ✅ Improvement demonstrated over legacy prompt
- ✅ No contradictory instructions found in review
- ✅ Documentation complete

### Ongoing Testing

**After deployment:**
- Monitor real user conversations
- Collect failure cases
- A/B test improvements
- Iterate based on feedback

## Conclusion

The structured restaurant waiter prompt template represents a significant improvement over the original static prompt in terms of:

- **Maintainability:** Clear structure and documentation
- **Flexibility:** Supports different learners and contexts
- **Quality:** Comprehensive edge case handling
- **Accountability:** Versioning and rationale tracking

**Key Success Factors:**
1. Explicit instructions with clear rationale
2. Balance between rules and guidelines
3. Comprehensive edge case handling
4. Variable configuration for customization
5. Built-in versioning and testing framework

**Next Steps:**
1. Complete manual testing (20 scenarios)
2. Gather team feedback
3. Iterate based on test results
4. Deploy version 1.0.0 when validated
5. Monitor real usage and continue improving

This foundation enables systematic improvement of ConvoAI's prompt quality over time.

---

**Document Version:** 1.0  
**Last Updated:** March 9, 2026  
**Prompt Version Documented:** 1.0.0 (Draft)  
**Authors:** ConvoAI Team
