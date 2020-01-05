
(() => {
    $(document).ready(() => {
        // Classes Data
        var classesData = {};
        var selectedClasses = [];
        var unselectedClasses = [];
        /***********************************************/
        // Functions
        var readSingleFile = (e) => {
            var file = e.target.files[0];
            if (!file) {
                return;
            }
            var reader = new FileReader();
            reader.onload = function(e) {
                var contents = e.target.result;
                parse(contents);
            };
            reader.readAsText(file);
        }
        
        var parse = (contents) => {
            var classesOrder = [];
            var firstLine = true;
            contents.split('\n').forEach(line => {
                if(line == ''){
                    return;
                }
                row = line.split(';');
                if(firstLine){
                    row.forEach(val => {
                        classesOrder.push(val);
                        addSelector(val);
                    });
                    firstLine = false;
                    return;
                }

                for (let i = 1; i < (row.length); i++) {
                    if(!classesData[classesOrder[i]]){
                        classesData[classesOrder[i]] = {skills:[]};
                    }
                    if(row[i] == ''){
                        continue;
                    }
                    let val = parseInt(row[i]);
                    if(Number.isInteger(val)){
                        classesData[classesOrder[i]][row[0]] = val;
                    } else {
                        classesData[classesOrder[i]].skills.push(row[i]);
                    }
                }
            });
            //console.log(JSON.stringify(classesData, null, 5));
        }

        var addSelector = (className) => {
            if(className == "Ability"){
                return;
            }
            unselectedClasses.push(className);
            var anchor = $("div#classes-selector");
            var fakeDir = '<button id="'+className+'" class="dos2-class">'+className+'</button>';
            anchor.append(fakeDir);

            $("button#"+className).click((event) => {
                switchState(event.target);
            });
        }

        var switchState = (classButton) => {
            classButton = $(classButton);
            if(classButton.hasClass('dos2-class-selected')){
                classButton.removeClass('dos2-class-selected');
                moveClass(classButton.attr('id'), false);
            } else {
                classButton.addClass('dos2-class-selected');
                moveClass(classButton.attr('id'), true);
            }
            displayCovering();
        }

        var moveClass = (className, selected) => {
            if(selected){
                selectedClasses.push(className);
                unselectedClasses.splice(unselectedClasses.indexOf(className),1);
            } else {
                unselectedClasses.push(className);
                selectedClasses.splice(selectedClasses.indexOf(className),1);
            }
            console.log(className, selected, JSON.stringify(selectedClasses));
        }

        var displayCovering = () => {
            var anchor = $("div#covering-results");
            anchor.empty();
            if(selectedClasses.length < 1){
                return;
            }

            var covering = {};
            selectedClasses.forEach((sClass) => {
                covering = {...covering, ...classesData[sClass]};
            });

            anchor.append('<pre style="background-color:gray;">'+JSON.stringify(covering, null, 2)+'</pre>');
        }

        var displayLacking = () => {
            var anchor = $("div#lacking-results");
            anchor.empty();
        }
        /***********************************************/
        // Listeners
        document.getElementById('file-input').addEventListener('change', readSingleFile, false);
    });
})();