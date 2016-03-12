(function() {

    window.onload = function() {
        // Caching degli elementi
        var x3d = document.getElementById("x3dElement");

        var upright = document.getElementById("upright-view");
        var reset_view = document.getElementById("reset-view");
        var show_all = document.getElementById("show-all");
        var navigation_init = x3d.runtime.navigationType();
        var select_teacher = document.getElementById("office");
        var select_navigation = document.getElementById("select-navigation");
        var viewpoints_init = document.getElementsByTagName("viewpoint");
        var scene = x3d.getElementsByTagName("scene")[0];
        
        
        // Chiamata AJAX per il recupero dei professori
        var xhr;
        if (window.XMLHttpRequest) { xhr = new XMLHttpRequest();
        } else {  xhr = new ActiveXObject("Microsoft.XMLHTTP"); }

        xhr.open("GET", "teacher.json", true);
        xhr.send(null);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status == 200) {
                    // Recupero dei professori
                    var teacher_object = JSON.parse(xhr.responseText);
                    var teacher_list = [];
                    var teacher_index = [];

                    for (var office in teacher_object) {
                        for (var i = 0; i < teacher_object[office].length; ++i) {
                            teacher_list.push(teacher_object[office][i]);
                            teacher_index.push(office);
                        }
                    }

                    // Ordinamento dei professori in ordine alfabetico con i relativi indici
                    sort(teacher_list, teacher_index);

                    select_teacher.add = add;
                    // Aggiungi i professori alla select-box
                    for (var j = 0; j < teacher_list.length; j++) {
                        select_teacher.add(teacher_list[j], "CA_Office_" + teacher_index[j] + "_View");
                    }
                    // Aggiungi toilette e sala incontri alla select-box
                    var opt_group = document.createElement("optgroup");
                    opt_group.label = "Other Room";
                    opt_group.add = add;
                    opt_group.add("Toilette", "CA_Toilette_View");
                    opt_group.add("Meeting Room", "CA_Meeting_Room_View");

                    select_teacher.appendChild(opt_group);

                    // Cambia viewpoint ufficio
                    select_teacher.onchange = function() {
                        var viewpoint = document.querySelectorAll('[DEF=' + select_teacher.value + ']')[0];
                        viewpoint.setAttribute("set_bind", "true");
                        x3d.runtime.noNav();
                        upright.disabled = true;
                        select_navigation.disabled = true;
                        init_viewpoints();
                    };
                    // Cambia tipo di navigazione
                    select_navigation.onchange = function() {

                        x3d.runtime[select_navigation.value]();
                        this.blur();
                        select_navigation.querySelectorAll('[value='+ navigation_init +']').selected = 'selected'
                    };

                    // Gestione Reset View
                    reset_view.onclick = function() {

                        var viewpoint =  document.querySelectorAll('[DEF=CA_Init_View]')[0];

                        viewpoint.setAttribute("set_bind", "true");
                        x3d.runtime[navigation_init]();
                        upright.disabled = false;
                        select_navigation.disabled = false;
                        init_viewpoints();
                    };  

                    // Gestione Show All
                    show_all.onclick = function() {
                        x3d.runtime.noNav();

                        var current_viewpoint = x3d.runtime.getActiveBindable("viewpoint");
                        current_viewpoint.removeAttribute("set_bind");
                        var show_all_viewpoint = document.getElementById("view_show_all");
                        
                        if(show_all_viewpoint === null) {
                            show_all_viewpoint = current_viewpoint.cloneNode();
                            show_all_viewpoint.id = "view_show_all";
                        }
                        show_all_viewpoint.setAttribute("DEF", "CA_Show_All_View");
                        
                        scene.appendChild(show_all_viewpoint);

                        show_all_viewpoint.setAttribute("set_bind", "true");
                        x3d.runtime.showAll("negY");

                        upright.disabled = true;
                        select_navigation.disabled = true;
                        init_viewpoints();
                    };

                    // Gestione Upright View
                    upright.onclick = function() {
                        x3d.runtime.uprightView();
                    };

                }
            }
        };

        function init_viewpoints() {
            var current_viewpoints = document.getElementsByTagName("viewpoint");

            
                for (var i = 0; i < viewpoints_init.length; i++) {
                
                    if(!current_viewpoints[i].isSameNode(x3d.runtime.getActiveBindable("viewpoint"))){
                        current_viewpoints[i].setAttribute("position", viewpoints_init[i].getAttribute("position"));
                        current_viewpoints[i].setAttribute("orientation", viewpoints_init[i].getAttribute("orientation"));
                        current_viewpoints[i].setAttribute("fieldofview", viewpoints_init[i].getAttribute("fieldofview"));
                    }else{

                        var clone = document.getElementById("clone");
                        if(clone !== null) clone.remove();

                        clone = viewpoints_init[i].cloneNode();
                        clone.id = "clone";
                        scene.appendChild(clone);
                        clone.setAttribute("set_bind", "true");

                    }
                    
                    
                }
                
            
        }


  
    };


    function add(text, value) {
        var option = document.createElement("option");
        option.text = text;
        option.setAttribute("value", value);
        this.appendChild(option);
    }

    function sort(teacher_list, teacher_index) {
        var n = teacher_list.length;
        for (var i = 0; i < (n - 1); i++) {

            for (var j = 0; j < n - i - 1; j++) {
                if (teacher_list[j] > teacher_list[j + 1]) {
                    var swap = teacher_list[j];
                    teacher_list[j] = teacher_list[j + 1];
                    teacher_list[j + 1] = swap;

                    swap = teacher_index[j];
                    teacher_index[j] = teacher_index[j + 1];
                    teacher_index[j + 1] = swap;
                }
            }
        }
    }

  
})();
