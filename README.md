Gluten
======

What is Project Gluten?

The goal is to build a better document editor. Word, OpenOffice, Google Docs are all "word processors". You can type things and style things.
But everything you style has to be done yourself.

As a student, I've spent countless hours formatting papers. I spent about an hour formatting a single paper and doing the bibliography.
Yes, tools exist to do this type of thing. I used EasyBib and that saved me some time, but all the other niche details that go into an essay
or another type of paper create a lot of stress and waste a lot of time. When 10% of your grade or more hangs on the tiny details, that's stressful.
Shouldn't writing a paper be about... the content?

The goal of Gluten is to be a lot of different things. Like LaTeX, you write the paper and then it generates a properly formatted paper
based on the type of paper you're writing. Everything, the title, bibliography, in-line citations, etc. are generated automatically from
simple UI elements. 

Automation is at the heart of Gluten. Type a quote in an essay. Context indicates you're going to quote something. So a popup appears.
You can type in the reference details. Then it creates a citation, underlined in blue. That's it. You're done. 

Generate the document. The bibliography appears, everything is perfect. Gluten will use plenty of contextual information to aid you as a writer get
past the boring stuff of writing - formatting and citations and everything else - and let you write.

This project is open source. Why? Because open source means more innovation. This extends to everything.

### Formats.js

Gluten currently only has one format set-up, a limited version of the APA format. People will want different things, and instead
of waiting for a large company to hear the wishes of one person, you can create your own format or modify one. This is 
really simple, using an easy to create but powerful framework that allows plenty of customization.

### Panels

Panels are one type of framework that developers can use to extend functionality. Like in other programs, a side of the screen
can be used to run microprograms. Gluten uses a simple but functional framework for panels that allows developers to customize
the size of the panels to whatever size they want to get the proper experience. It is easy to set up and run a panel program.

Panels will be run either from the menubar or the toolbar.

### Popups

While not available yet, popups are a simple way to display mainly text based information. While allowing actions, it is mainly for reference material.
Looking up an entry through Wikipedia, or getting a unit conversion. Popups are going to be slightly inspired by Google's Card UI to be simple and get the point 
across quickly. While the popup framework can be used to create simple card UIs, developers won't be restricted to this type at all.

Popups will run mainly from the context menu, but can be called through panels too.

#### Difference between Panels and Popups
Panels - Meant for more action and user input

Popups - Meant more for display purposes, more output than action

*Conclusion*

Gluten promises to optimize the writer's workflow, creating a great experience for them and encouraging writing in other students by 
removing the barrier of formatting that creates a large amount of friction.
