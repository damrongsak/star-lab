00:00
All right, so first thing first, I want to talk about what's the problem we're trying to solve. So the biggest problem

00:03
here is that let's say if you're a front-end engineer and you're trying to use claw code here to build front-end

00:07
applications and the biggest problem here is that claw code is not able to open the browser and be able to navigate

00:12
to the application and verify those changes that's been made. And of course, we all know that claw code is able to

00:17
look at the console logs, be able to look at the codebase to verify those changes. But that's not enough, right?

00:22
Because we need claw code here to be able to see the changes being made. And whenever we provide a plan for clock

00:27
code to execute, clock is able to code that feature. But they have no idea that the feature that they have implemented

00:33
is accurate based on the requirements that we set. And that is really where the solution comes in which is using a

00:38
MTP server called playright which can simply give clock here the vision access to navigate to the application itself.

00:44
And it should be able to navigate to different pages, be able to perform some browser actions like clicking, be able

00:49
to scroll down or be able to enter the form and be able to verify those changes that's being made. And that's really

00:54
important because without this tool clock here just blindly implementing the features based on the logs and the

00:59
codebase and that's not what we want in our front end development. We want the front end development here to have clock

01:04
here to view the application and verify those changes whenever it implement the features. Now you know the why but let's

01:09
take a look at how it fits into our development workflow. So usually what we have is we start with the spec

01:14
development where we have our spec or plan for the features on how we're going to implement this. Then we're going to

01:20
pass the plan to clog code to execute the plan. So it's going to take the plan that we have and start to code the

01:25
features that we have. After it code the features for our front-end developments, it's going to use a tool check called

01:30
playright and clock here is going to use playright tool to check the features that's implemented. For example, is able

01:35
to take screenshots, navigate to different parts of the page, set the different screen sizes, and is also able

01:40
to look at the browser console logs and also the network logs to verify those changes. So then after it verifies those

01:46
changes, clock code then basically think about it and start to look at what are the things that needs to change, create

01:51
a plan and be able to loop through this workflow continuously to improve our front-end application. All right, so now

01:56
you know the why and also how it fits into our workflow. Let's take a look at how we can be able to use this inside of

02:02
our front-end development. Before I get into this, if you do found value in this video, please make sure to like this

02:06
video, consider subscribe for more content like this. But with that being said, let's continue the video. So here

02:11
you can see I navigate to playright MCTP GitHub page and if you were to scroll down it tells you exactly how you can

02:16
configure this and add it onto your MCP servers. So if you're using clco like myself you can simply just copy this

02:22
command here and be able to install this. So in that case inside of my terminal I can simply just run this

02:26
command here and it will install playright onto my MCP server. Now here inside of a new terminal here I'm just

02:32
going to run claw code again and let's say if I were to do MCP servers here you can see we have our playrights which

02:38
connected here. And here if I were to enter to the view more details and here inside of this you can see that it has

02:43
total of 21 tools. So we can actually be able to click on view tools here and you can see these are all the tools that I

02:49
can use. For example I can close the browser, resize the browser, get the console messages, right? And be able to

02:54
upload files, be able to press any keys, enter any text and be able to navigate to websites and so much more. Right? So

03:00
be able to take screenshots, click things, any browser action you can think of. It has those tools here. All right.

03:07
So now what I want to talk about is how we can be able to integrate our playwrights into our claw code

03:11
development workflows. So right now you can see that currently I'm inside of the cloud MD file and these are some changes

03:16
that I have made. So I basically add a section called the visual development and testing. So whenever we implementing

03:22
something any changes on the front end side of things is going to do this quick visual check. Now before I dive into

03:28
this, I also wanted to mention that this is the design system, the design principles that we follow whenever it's

03:33
going to do any developments and you can be able to view this inside of the context. So there is a design principles

03:38
which is created. You can see that these are the design principle for the strategies on how is it going to create

03:44
a better UI user interface for the front-end applications. Right? So things like the border, the spacing, uh layout,

03:51
the visuals. So these are the design principles that we set and pretty much it's going to follow this principle here

03:56
to develop the application and then here for the quick visual check you can see here that first it's going to identify

04:02
what changes and also try to navigate to the affected pages using the MTP server for playrights to visit each change view

04:09
and also be able to compare against design principle that we follow also validate the feature implementations

04:15
check the acceptance criteria to making sure that we're meeting the requirements and also capture the evidence for the

04:20
screenshots of each change and also be able to check for any errors. So these are basically the steps that I have

04:25
clock code to follow whenever we try to make any front-end changes. And below this I also have add a section for the

04:32
comprehensive design reviews. So after we have made those changes whenever we try to merge the pull request for

04:37
example it's also going to trigger this design review agents called the agent design review. So here inside of the

04:44
clock code here I have uh added a new agent called design review agents which currently you can see this is basically

04:50
the descriptions and what's happening here is that we're using sub agent here to trigger this review process to test

04:56
all the interactive states verify the responsiveness check accessibilities right test the edge cases everything and

05:02
then here you can see we also have mentioned about the essential commands for UI testing so things like how we can

05:06
be able to navigate to different pages how we can be able to take screenshots set the browser size for example the

05:11
width and height to test the responsiveness of the application and also how we can be able to interact with

05:16
testings like clicking be able to input things be able to hover any states and also how we can be able to validate the

05:22
data for example like checking for errors for the console or look at the accessibilities and take a look at the

05:27
elements in the page ensure that it's actually loaded so these are some common uh commands that we can use in playrs

05:33
which I have mentioned here and then also the compliance checklist so these are the list of things that is going to

05:38
follow to making sure that it's compliant with the standard that we set here like the mobile size is going to be

05:44
375 pixels, tablet is 768 and desktop is this much. Right? So we check for these things and also the loading time and so

05:51
much more. And the next section that I also added is when to use this automated visual testing. So here you can see this

05:57
is when we're going to use the visual check and this is when we're going to use the comprehensive design reviews,

06:02
right? for example like a major feature implementations or whenever we do like refactoring components we will use the

06:08
review agent here to check that and when to skip the visual testings. So for example whenever we implementing the

06:14
backend features or documentation updates we don't have to do the visual testing right so that's something that

06:20
we want to mention to claw code that it's not like every time when we send a request claw code is going to do the

06:26
visual testing right so that's pretty much the sections that I have added in claw code file to making sure that claw

06:32
code here is able to use playrides whenever we try to do our front-end development here okay all right so

06:37
pretty much once we had this set up now it's pretty much a go time so here inside of our application which is what

06:43
it looks like here. You can see after a user logged in this is what the application look like. So we can simply

06:47
like the user be able to dislike the user we can be able to uh search for different age range right we can be able

06:52
to send a message to uh different users here. So what I can do is I can be able to use the design review agent which you

06:58
know uses the MTV server for playrs to demo this for testing. So in that case to test this I basically first reference

07:04
the agent which is to using the design review agent right here and here I basically mentioned to navigate the

07:10
application and test the login feature with the login as this person with the password password to test the members

07:18
page. So let's say if I were to run this and let's try to see what it does here.

07:21
All right. All right. So now you can see it starts it opens the application in a new browser here and first thing first

07:26
you can see it start to take a screenshot save it inside of this folder and here you can see it decides where

07:31
the login button is and then it's clicking that login button here automatically. So now you can see it

07:36
start to autofill the password the emails and log into the application.

07:40
Navigate to the members page and here you can see it start to resize the browser window to check for responsiveness of the application. All

07:47
right. So now you can see eventually it's fully tested for the login flow for the members page responsive design and

07:53
also the visual consistency. So here you can see it also lists out the areas to improve like the loading states, the

07:58
performance could be optimized using the lazy loading for the images and also the accessibilities. So pretty much you can

08:04
see that we can use claw here to use the playright mcb server to navigate to our application be able to do the visual

08:09
testings based on our application. Now of course we can also be able to view the changes or the photos that is being

08:14
captured every single steps. So for example on the homepage this is what it looks like and on the login page this is

08:20
what it looks like after the form is validated with a email you can see that this is what it looks like and if they

08:26
put a invalid email this is what the air looks like. So it is able to capture each step for the workflow on how is

08:32
able to test the application. So things like filter for only females only look for all the users. Here you can see this

08:38
is the responsive view for the mobile size and also this is the tablet size.

08:42
So you can see that there's some responsive problems that we need to fix.

08:45
So in that case, let's have clock code to fix that issue. And like what we just mentioned here inside of our claude.md

08:51
file is that every time when clock make any changes, clock code should automatically be able to verify that

08:56
change using the playright. So in that case, I'm just going to reference that file. It should be inside of this. There

09:01
is a mobile view. So I'm just going to reference this and say that please fix this responsive design issue. And

09:10
hopefully after it fix it, it should be able to run the MCB server to verify that change. So here you can see it's

09:16
going to analyze the response of the design issue and fixing it. Then it start to target which component and

09:20
where exactly in the application causing the issue which is the member sidebar which showing here and if we were to

09:26
look at the image you can see that the sidebar here basically collapsed into one cluster. So now you can see that it

09:31
started to generate a to-do list on what are the things that needs to fix. So here is going to fix the response design

09:36
and here you can see after fix it opens the application using the MCB server here uh resize the screen here and try

09:43
to verify the change. So here you can see it's calling the playright MTB server here to navigate to these pages and be able to change the screen size.

09:50
And here you can see the mobile response design is is much more better. Right? So here you can see it's going to run the

09:55
MM run build to see if there's any TypeScript errors based on the fix that's made and also try to click on

10:00
different buttons on the sidebar to see if everything is fully functional. So here you can see this is the application

10:05
which currently everything is working correctly. So basically you can see this is the first row, this is the second row

10:11
and this is the third row which organized into different rows for the sidebar which we can also see the image

10:16
here as well. All right so lastly also want to make sure to commit those changes here and simply I'm just going

10:20
to commit this and making sure that you can be able to see the changes that I made for this video. Now speaking of

10:24
keeping track of the progress the other part that we want to keep track is the memories that we interact with for a

10:29
larger language model and that's where the sponsor of this video comes in by Rover. They have built a central memory

10:34
layer for modern dev teams using coding agents. Now, chances are you have been in this situation. You're coding with an

10:40
AI IDE like cursor or clock code and you have spent all your time carefully describing your project context. But the

10:46
next day when you start a new session, all of the knowledge is gone and you have to waste time explaining everything

10:51
from scratch or maybe you're working with your team. But all the valuable lessons from past interactions, the best practices, the bug fixes are all siloed.

10:59
They aren't shared across the team. So your colleagues agents keeps making the same mistake over and over again. and

11:05
you know that basic rule files like claw.md file just aren't enough for the massive codebase or maybe you start in

11:11
cursor switch over to Gemini CLI or any other agents and none of that context carry over but bite over here solves all

11:18
that what if your AI agents can actually remember all that context permanently with biteover your project knowledge is

11:25
saved everything from highle programming concepts to specific business logics past interactions bug fixes even the

11:32
model's own reasoning steps this gives your agents maximum context, enabling smarter, more accurate code as your

11:39
project grows. You can think of it as a unified memory layer shared across all your favorite coding IDs like cursor,

11:47
claw code, VS code, and more. So, it scales right alongside your codebase.

11:51
For all my fellow open source fans, Brover just launched Cipher, an open- source memory layer that you can plug

11:57
directly into your IDE with zero configuration. Both of these tools are designed to make your coding agents more

12:03
intelligent and genuinely useful. It's completely free to get started. So to check out the link in the description to

12:08
try it out. So pretty much you can see that what I just demoed is that whenever we try to implement a feature, cloud

12:13
code is automatically using playright here to verify that change and I have also show you how you can be able to use

12:18
the sub agent here which uses a playright to verify the changes inside of your application. All right, so pretty much that's it for this video.

12:25
Hopefully you found value in this video.

12:26
Pretty much in this video, we cover why we should use playright here to improve our front-end developments and also how
