# The Anti-Poker Protocol 
### JS13K_Triskaidekaphobia

Gamejam Theme: Triskaidekaphobia

Game Created by Alex Delderfield (Alex_ADEdge), 2024, for the #JS13K gamejam.

Framework: None! Pure javascript. 13,312 bytes maximum file size for final build.

Final Gamejam Submission: https://js13kgames.com/2024/games/the-anti-poker-protocol

<img src="/docs/images/minicards2.png" alt="screenshot" width="120px">

---

# JS13K Post-Mortem [The Anti-Poker Protocol] 

## The Beginning

Heres a breakdown of the 31 days of dev which went into creating this entry, a 13kb-limited mostly-javascript game for the js13k gamejam.

This was my 4th time participating in the js13k gamejam, and (spoilers) I finally found myself with an end result worth submitting! 

(links to final game/entry)

## Early Dev / The Beginning

## Midway Point & Refactor

## Burnout Zone

## Final Days, Code Butchering & Submission Chaos

## Conclusion

## In Review: What went well?

Core Gameplay Feature 1st (card movement/handling) - altho a lot of the complexity in this was left until the end of the gamejam (bad idea), the core feature of this game was moving cards around the table, and I had the most basic version of that working on day 2 which was great 

Focusing on graphics early (not a popular approach but this works best for me personally)

uix class (great improvement vs last gamejam)

Gameplay loop very early on (win/lose condition) - this is always something I aim to do, and I could aim to get it done even earlier. Its very motivating to have a full (even if its super simple) gameloop working as early as possible

Aiming to work on the project every day - want to be consistent? Work on whatever goal you have every single day, if you dont leave room for excuses then youre much less likely to start making them 

managing burnout - taking a break some days and doing minimal dev on those days, plus motivating myself to get back into the dev by working on a fresh or fun feature (like taking some time to just mess around with CRT was a good 'break' but also motivated me a lot in getting back into the dev once I felt less burntout)

Graphics! CRT was a great additon, color pallette added to this even more and made dev easier as I didnt need to experiement with colors so much with that limitation in place, I am very happy with the graphics I managed to put together for this game 

Build setup / approach 

## In Review: Future Improvements?

More code golfing techniques
already looking at things, like how to write classes which avoid using 'this', as I found that was a big chunk of my code from all the work in classes 
being aware of hex values early on (all the colors add a lot of file size, I should use color register values and limited pallette from the start) I would like to challenge myself by sticking 100% to a pallette - ie in this gamejam I mostly stuck to a pallete by the end, but still had some other manually specified colors - especially for darker values and in the game table scene rendering 

Scope creep! (and keeping things simpler, while also appreciating the fact I enjoy making complex setups - this is just something I need to control a bit more in future and make sure I stay aware of)

More theme, early on - integrate the theme of the gamejam into the game much earlier on, I wasnt too happy with 

Features & big code changes in the final hours - very scary and bad!

compression / .zip process in final hours (made it very stressful as I haddnt optimized or worked out this process and had the dramas with 7z)

Music - Need a better approach here, I have some ideas on a minified approach to music which I need to experiment with and setup - based on a workflow I did manage to get working this gamejam. And overall just need more practice/confidence in composing even simple music tracks.

Playtesting

## Thanks
