# Markdown Usage Guide for NEET-UG MCQ Platform

## Overview

The NEET-UG MCQ Platform supports full markdown syntax in the **Question Text** field when creating questions. This allows teachers to create rich, formatted questions including tables, lists, bold/italic text, and more.

## Where Markdown Works

Markdown is supported in:
- Question Text field (Teacher Dashboard - Question Form)
- Questions are automatically rendered with markdown formatting in:
  - Question List (Teacher Dashboard)
  - Quiz View (Student Dashboard)
  - Options can also contain basic markdown

## Basic Markdown Syntax

### Bold and Italic

```markdown
**This text is bold**
*This text is italic*
***This text is bold and italic***
```

**Rendered as:**
- **This text is bold**
- *This text is italic*
- ***This text is bold and italic***

### Headings

```markdown
# Heading 1
## Heading 2
### Heading 3
```

### Line Breaks

Add two spaces at the end of a line or use a blank line for paragraph breaks.

### Lists

**Unordered List:**
```markdown
- Item 1
- Item 2
- Item 3
```

**Ordered List:**
```markdown
1. First item
2. Second item
3. Third item
```

## Tables (Important for NEET Questions)

Tables are extremely useful for presenting data in NEET questions. The platform has enhanced table styling with:
- Bordered cells for clear data separation
- Alternating row colors for better readability
- Hover effects for interactive feel
- Proper dark mode support
- Responsive layout

Here's how to create them:

### Basic Table Syntax

```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data 1   | Data 2   | Data 3   |
| Data 4   | Data 5   | Data 6   |
```

### NEET Biology Example

```markdown
Study the following table showing the rate of mineral uptake in different regions of a root:

| Root Region         | Permeability | Nutrient Uptake Rate |
|---------------------|--------------|----------------------|
| Root Hair Zone      | High         | Maximum              |
| Mature Zone         | Medium       | Moderate             |
| Meristematic Zone   | Low          | Minimum              |

**Question:** Which region absorbs the most minerals?
```

### Chemistry Table Example

```markdown
Observe the following data for different acids:

| Acid Name        | Formula | pKa Value | Strength |
|------------------|---------|-----------|----------|
| Hydrochloric     | HCl     | -7        | Strong   |
| Acetic           | CH3COOH | 4.76      | Weak     |
| Nitric           | HNO3    | -1.4      | Strong   |

**Question:** Which acid has the highest pKa value?
```

### Physics Table Example

```markdown
The following table shows motion data for different objects:

| Object | Initial Velocity (m/s) | Final Velocity (m/s) | Time (s) |
|--------|------------------------|----------------------|----------|
| A      | 0                      | 20                   | 4        |
| B      | 10                     | 30                   | 5        |
| C      | 5                      | 25                   | 4        |

**Question:** Which object has the highest acceleration?
```

## Complete Question Example

Here's a complete example of how to create a question with markdown:

### Example 1: Biology with Table

**Question Text:**
```markdown
Study the following comparison of plant tissues:

| Tissue Type | Cell Wall | Function           | Location        |
|-------------|-----------|-------------------|-----------------|
| Parenchyma  | Thin      | Storage           | Throughout      |
| Collenchyma | Thick     | Support           | Peripheral      |
| Sclerenchyma| Very Thick| Mechanical Support| Throughout      |

Based on the table above, which tissue provides **maximum mechanical support**?
```

**Options:**
- A) Parenchyma
- B) Collenchyma
- C) Sclerenchyma
- D) All equally

**Correct Answer:** C

**Explanation:**
```markdown
Sclerenchyma has the thickest cell walls and provides maximum mechanical support to plants.
```

### Example 2: Chemistry Question

**Question Text:**
```markdown
Consider the following reaction:

2H₂ + O₂ → 2H₂O

Calculate the number of moles of water formed when **4 moles** of hydrogen react completely with oxygen.

*Given: All measurements are at STP*
```

**Options:**
- A) 2 moles
- B) 4 moles
- C) 8 moles
- D) 1 mole

### Example 3: Physics with Formatting

**Question Text:**
```markdown
A particle moves with **uniform acceleration**. Its velocity changes from *10 m/s* to *30 m/s* in 4 seconds.

Calculate:
1. The acceleration of the particle
2. The distance covered in this time

**Note:** Use standard equations of motion.
```

## Tips for Creating Effective Questions

### 1. Use Tables for Data
When presenting multiple data points, always use tables instead of listing them in text. Tables are easier to read and compare.

### 2. Use Bold for Emphasis
Highlight important terms or values using **bold** formatting:
```markdown
A solution has a pH of **7.4**. Calculate the [H⁺] concentration.
```

### 3. Use Lists for Multi-Part Questions
```markdown
Analyze the given data and answer:
1. What is the mean value?
2. What is the standard deviation?
3. Which observation is an outlier?
```

### 4. Combine Markdown Elements
```markdown
## Experiment Analysis

**Observation Table:**

| Sample | Temperature (°C) | pH  | Result   |
|--------|------------------|-----|----------|
| A      | 25               | 7.0 | Neutral  |
| B      | 37               | 6.5 | *Acidic* |
| C      | 45               | 7.5 | Basic    |

Based on the data, which sample shows **acidic** nature?
```

## Markdown Limitations

### What Works:
- Tables
- Bold and italic text
- Lists (ordered and unordered)
- Headings
- Line breaks
- Basic HTML (sanitized)

### What Doesn't Work:
- JavaScript or executable code
- Unsafe HTML (will be sanitized)
- External scripts
- Complex nested structures

## Testing Your Markdown

After creating a question:
1. The question will appear in the Question List with rendered markdown
2. Students will see the formatted version in Quiz View
3. Check the preview to ensure formatting looks correct

## Common Mistakes to Avoid

### 1. Missing Pipe Characters in Tables
**Wrong:**
```markdown
| Column 1 | Column 2
|----------|----------
| Data 1   | Data 2
```

**Correct:**
```markdown
| Column 1 | Column 2 |
|----------|----------|
| Data 1   | Data 2   |
```

### 2. Inconsistent Column Count
Make sure all rows have the same number of columns.

### 3. No Space After Hash for Headings
**Wrong:** `#Heading`
**Correct:** `# Heading`

### 4. Forgetting Blank Lines
Always add blank lines before and after:
- Tables
- Lists
- Headings

## Need More Help?

For a complete markdown reference, visit: [Markdown Guide](https://www.markdownguide.org/basic-syntax/)

The platform uses standard markdown syntax, so any valid markdown should work correctly.
