import g from"broken-link-checker";import{setFailed as l}from"@actions/core";import*as m from"@actions/github";var d="# Broken Link Checker";async function k({octokit:n,owner:t,repo:s,prNumber:o}){try{let{data:e}=await n.rest.issues.listComments({owner:t,repo:s,issue_number:o});return e.find(i=>i.body?.includes(d))}catch(e){l("Error finding bot comment: "+e);return}}async function f(n,t){let s="Broken Link Checker",o=`Found ${n} broken links in this PR. Click details for a list.`,e=`[See the comment for details](${t})`,{context:i,getOctokit:r}=m,a=r(process.env.GITHUB_TOKEN),{owner:c,repo:u}=i.repo;if(i.payload.pull_request){let p=i.payload.pull_request?.head.sha,h={owner:c,repo:u,name:s,head_sha:p,status:"completed",conclusion:"failure",output:{title:s,summary:o,text:e}};try{await a.rest.checks.create(h)}catch(b){l("Failed to create check: "+b)}}}var y=async(n,t=0)=>{try{let{context:s,getOctokit:o}=m,e=o(process.env.GITHUB_TOKEN),{owner:i,repo:r}=s.repo,a;if(s.payload.pull_request?a=s.payload.pull_request?.number:s.payload.issue&&(a=s.payload?.issue?.number),!a)return l("Count not find PR Number"),"";let c=await k({octokit:e,owner:i,repo:r,prNumber:a});if(c){console.log("Updating Comment");let{data:u}=await e.rest.issues.updateComment({owner:i,repo:r,comment_id:c?.id,body:n});return u.html_url}else if(t>0){console.log("Creating Comment");let{data:u}=await e.rest.issues.createComment({owner:i,repo:r,issue_number:a,body:n});return u.html_url}return""}catch(s){return l("Error commenting: "+s),""}},C=n=>{let t=`${d}

> **${n.links.length}** broken links found. Links organised below by source page, or page where they were found.
`,s=n.links.reduce((o,e)=>(o[e.base.resolved]||(o[e.base.resolved]=[]),o[e.base.resolved].push(e),o),{});return Object.entries(s).forEach(([o,e],i)=>{t+=`

### ${i+1}) [${new URL(o).pathname}](${o})

| Target Link | Link Text  |  Reason  |
|------|------|------|
`,e.forEach(r=>{let a=process.env.VERCEL_PREVIEW_URL||"https://docs.gitbutler.com",c=new URL(r.url.resolved).hostname===new URL(a).hostname?new URL(r.url.resolved).pathname:r.url.resolved;t+=`| [${c}](${r.url.resolved}) | "${r.html?.text?.trim().replaceAll(`
`,"")}" | ${r.brokenReason} |
`})}),n.errors.length&&(t+=`
### Errors
`,n.errors.forEach(o=>{t+=`
${o}
`})),t};async function O(){if(!process.env.GITHUB_TOKEN)throw new Error("GITHUB_TOKEN is required");let n=process.env.VERCEL_PREVIEW_URL||"https://docs.gitbutler.com",t={errors:[],links:[],pages:[],sites:[]},s={excludeExternalLinks:!1,excludedKeywords:["gitlab.com/-","platform.openai.com","https://github.com/gitbutlerapp/gitbutler-docs/blob/main/content/docs","https://github.com/gitbutlerapp/gitbutler-docs/issues","Edit on GitHub"],honorRobotExclusions:!1,filterLevel:0};new g.SiteChecker(s,{error:e=>{t.errors.push(e)},link:e=>{e.broken&&t.links.push(e)},end:async()=>{if(t.links.length){let e=t.links.filter(a=>a.broken&&!["HTTP_308","HTTP_429"].includes(a.brokenReason)),i=C({errors:t.errors,links:e,pages:[],sites:[]}),r=await y(i,e.length);await f(e.length,r),e.length&&l(`Found ${e.length} broken link(s)`)}}}).enqueue(n)}O();
