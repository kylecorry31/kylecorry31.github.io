---
title: Generative AI Assisted Content
summary: Improving drawings and writing using generative AI.
date: 2025-04-06
---

Many people view generative AI art/writing in a negative light because it has the potential to replace the creative, human touch on a project and may take on the style of other artists/writers. I'm also not a fan of letting generative AI create for me unless it's a throwaway script, and would rather learn the new skills myself. But I believe generative AI can be a tool just like spell check, grammar check, or code smell detection. Therefore I only leverage generative AI as a review tool after I do all the creative work.

## Process
This is an iterative process and as my skills improve, I need fewer iterations to produce the same quality result.

### Drawings

1. Gather reference images of what I'm drawing.
2. Freehand sketch the subject by breaking it into component shapes and many rough lines.
3. Refine the freehand sketch and outline in pen.
4. If the refined drawing still looks off to me, I upload it to ChatGPT 4o with the prompt: **"Keeping the same style and pose, create a new image that ONLY corrects proportion issues in my image. It should look really close to the original."** This does a good job of keeping my artwork while also making subtle tweaks to the proportions. This only works with the new ChatGPT 4o model; the diffusion-based generative AI approaches tend to replace your whole image.
5. Overlay that on top of my original drawing to see where it corrected proportions. Do this either in an image editor as opacity layers or by printing and using a lightbox.
6. Lightly trace the original drawing in pencil and redraw while trying to factor in the better proportions.
7. Return to step 3 and keep repeating until the drawing looks correct.
8. Digitize it by scanning the photo and tracing the lines.
9. Add color, shading, filters, etc.

### Writing

Generative AI can be used as a glorified spell/grammar checker and tends to do a better job than many free grammar checking tools.

1. Write the content.
2. Run it through spell and grammar checking with a tool such as Grammarly or Word/LibreOffice.
3. Upload it to a generative AI tool with the prompt: **"Proofread this and ONLY make minor corrections to grammar or spelling if needed. Don't change it much."** This will output your text with some minor adjustments.
4. Since I use git for tracking, I commit my original text and then replace it with the generated text. I then switch over to the git changes view (in VS Code, this is the Source Control tab) and review the changes. The above prompt is pretty good at limiting changes, but when it decides to rewrite something entirely, I discard that and just use it as a reference for how to make my text clearer.