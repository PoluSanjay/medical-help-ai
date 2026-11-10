<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Analyzer AI runs only on the Lovable server; Vercel deployments proxy via /api/public/analyze and /api/public/follow-up (Bearer ANALYZER_SHARED_SECRET) when ANALYZER_API_URL is set — keeps LOVABLE_API_KEY off Vercel.
