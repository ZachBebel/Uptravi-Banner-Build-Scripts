# Uptravi-Banner-Build-Scripts

These are a collection of scripts I wrote for managing the builds of 86 HTML5 banners.

## Gruntfile.js

The objective of this script is to determine the directory structure of a source folder using a predefined JSON object and then procedurally create an output folder with that same structure using Grunt’s sequenced build operations. 

* Each build operation or “task” is assigned within a series of nested loops that iterate through all possible permutations of build paths using the JSON object and the source folder structure.
* Tasks are uniquely determined by the file path from the source folder (root), where each subdirectory name is represented by an object within the JSON object.

#### Note:
* Grunt performs tasks only after lining them up in a single queue, so it is necessary for variables used in tasks to be assigned through specific function calls so that their intended values are used once the queue executes. Otherwise, each task will only using the last assigned value to each variable if those values were assigned directly by normal means within the loop that queues the tasks.
* Banner permutations are numerically assigned via the variable “currentBanner” in order to enable users to efficiently switch between working on any one banner.


## _nested_for_loops.html

The proof of concept for improving the current script in Gruntfile.js to become more modular by replacing hard-coded nested for loops with a single dynamic recursive function. This way, any user adjustments in the JSON will automatically be reflected within the for loops. 


## staging_template/index.html

This HTML file was created so that clients may easily jump between all 86 banners using labeled dropdowns and tabs. The script uses a predefined JSON object in order to correctly adjust the labels so that users may only select and see what permutations exist within the source folder.
