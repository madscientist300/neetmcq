# Markdown Editor Usage Guide

## Overview

The NEET-UG MCQ Platform includes a powerful markdown editor with live preview functionality. This guide will help you create perfectly formatted questions.

## How to Use the Editor

### Step 1: Access the Question Form

1. Login as a Teacher
2. Navigate to the Teacher Dashboard
3. Scroll to "Create New Question" section

### Step 2: Understanding the Interface

The markdown editor has two main tabs:

#### Edit Tab
- This is where you write your content
- Use standard markdown syntax
- Type naturally with formatting codes
- Character counter shows at the bottom

#### Preview Tab
- Click to see rendered output
- Shows exactly how students will see it
- Tables, formatting, everything renders properly
- Switch back to Edit to make changes

### Step 3: Using Markdown Help

Click the "Markdown Help" button (top-right of editor) to see:
- Quick syntax reference
- Common formatting examples
- Link to complete guide

### Step 4: Creating a Table-Based Question

**In Edit Tab, type:**
```markdown
Study the following data:

| Parameter | Value A | Value B |
|-----------|---------|---------|
| pH        | 7.2     | 6.8     |
| Temp (°C) | 37      | 25      |

**Question:** Which sample is more alkaline?
```

**In Preview Tab, you'll see:**
A properly formatted table with borders, the question in bold.

### Step 5: Adding Formatting

**Bold text:**
```markdown
**This is important**
```

**Italic text:**
```markdown
*This is emphasized*
```

**Lists:**
```markdown
1. First point
2. Second point
3. Third point
```

**Combining:**
```markdown
The enzyme shows **maximum activity** at:
- pH: *7.4*
- Temperature: **37°C**
- Substrate: *Specific*
```

## Best Practices

### 1. Always Preview Before Submitting
- Click Preview tab to verify formatting
- Check tables render correctly
- Ensure bold/italic text appears as intended

### 2. Use Tables for Data
Tables make questions clearer:
```markdown
| Organism | Respiration Type |
|----------|------------------|
| Yeast    | Facultative      |
| E. coli  | Facultative      |
```

### 3. Use Bold for Emphasis
Highlight key terms:
```markdown
Which process produces **ATP** without oxygen?
```

### 4. Structure Multi-Part Questions
```markdown
## Part A: Observation

Study the diagram showing cell division.

**Question 1:** Identify the phase.

## Part B: Analysis

**Question 2:** What happens next?
```

### 5. Add Line Breaks Properly
- Use blank lines between paragraphs
- Tables need blank lines before and after
- Lists need blank lines before them

## Common Issues and Solutions

### Issue 1: Table Not Showing
**Problem:** Table appears as plain text

**Solution:**
- Ensure blank line before table
- Check all rows have same column count
- Verify pipes (|) at start and end

**Correct:**
```markdown
Here is the data:

| A | B |
|---|---|
| 1 | 2 |
```

**Incorrect:**
```markdown
Here is the data:
| A | B |
|---|---|
| 1 | 2 |
```

### Issue 2: Bold Not Working
**Problem:** `**text**` shows literally

**Solution:** Ensure no spaces inside asterisks

**Correct:** `**bold**`
**Incorrect:** `** bold **`

### Issue 3: List Not Formatting
**Problem:** Numbers/bullets don't appear

**Solution:** Add blank line before list

**Correct:**
```markdown
The options are:

1. Option one
2. Option two
```

**Incorrect:**
```markdown
The options are:
1. Option one
2. Option two
```

## Advanced Examples

### Example 1: Chemistry Question with Table

**Edit Tab:**
```markdown
Observe the following reaction data:

| Catalyst | Rate (mol/s) | Activation Energy (kJ) |
|----------|--------------|------------------------|
| Pt       | 0.5          | 45                     |
| Ni       | 0.3          | 52                     |
| None     | 0.05         | 85                     |

**Question:** Which catalyst is most effective?

*Hint: Consider both rate and activation energy.*
```

**Preview Tab shows:**
A beautifully formatted table with borders, bold question, and italic hint.

### Example 2: Biology Question with List

**Edit Tab:**
```markdown
A cell undergoes the following changes:

1. DNA replication occurs
2. Chromosomes condense
3. Nuclear envelope breaks down
4. Spindle fibers form

**Question:** Which phase is this?

**Options:**
- A) Prophase
- B) Metaphase
- C) Anaphase
- D) Telophase
```

### Example 3: Physics Question with Math

**Edit Tab:**
```markdown
A projectile is launched with:
- Initial velocity: **50 m/s**
- Angle: *45°*
- g = 10 m/s²

**Question:** Calculate maximum height.

**Formula:** H = (v²sin²θ) / 2g
```

## Tips for Efficient Workflow

### 1. Use Keyboard Shortcuts
- Tab: Switch between Edit and Preview (click)
- Write → Preview → Edit → Repeat

### 2. Copy from Previous Questions
- If you have a working table format
- Copy the markdown syntax
- Modify the data

### 3. Test Complex Formatting
- Create a draft question first
- Test tables in Preview
- Once working, use same format

### 4. Keep Markdown Guide Open
- Open MARKDOWN_GUIDE.md in another tab
- Reference while creating questions
- Copy examples that work

### 5. Use Character Counter
- Bottom of editor shows character count
- Helps keep questions concise
- Aim for clarity over length

## Quick Reference Card

| What You Want | Markdown Syntax | Result |
|---------------|-----------------|--------|
| Bold | `**text**` | **text** |
| Italic | `*text*` | *text* |
| Heading | `## Title` | Large heading |
| List | `- Item` | • Item |
| Table | `\| A \| B \|` | Bordered table |

## Explanation Field

The Explanation field also supports markdown but with simplified interface:
- No help button (to reduce clutter)
- Same Edit/Preview tabs
- Same markdown features
- Use for detailed answer explanations

**Example Explanation:**
```markdown
The correct answer is **C) Sclerenchyma**.

**Reasoning:**
1. Sclerenchyma has thick lignified walls
2. Provides maximum mechanical support
3. Found throughout the plant body

*Note:* Collenchyma provides flexible support, not rigid.
```

## Troubleshooting

### Editor Not Appearing
- Refresh page
- Check you're logged in as Teacher
- Verify browser supports modern JavaScript

### Preview Shows Nothing
- Check Edit tab has content
- Ensure content isn't just whitespace
- Try typing something simple first

### Formatting Looks Wrong
- Switch to Edit tab
- Check markdown syntax
- Look for missing asterisks or pipes
- Verify blank lines where needed

## Summary

The markdown editor makes creating professional questions easy:
- ✅ Write in Edit tab
- ✅ Preview to verify
- ✅ Use help for reference
- ✅ Create tables easily
- ✅ Format text properly
- ✅ See character count
- ✅ Dark mode support

For complete markdown syntax reference, see [MARKDOWN_GUIDE.md](./MARKDOWN_GUIDE.md)

Happy question creating!
