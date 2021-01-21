$(function() {
    var maxId = 0;
    // ������������� ������� �� ������ ���������� ������
    function create_table(data) {
        $.each(data, function(i, location) {
            add_row(i, location);
            maxId = i;
        });
    }

    function add_row(i, location) {
        table.append("<div class='row'><div class='default'>"+i+"</div><div class='span1'><input type='checkbox'/></div><div class='text'><span class='city'>" + location.city + "</span><br/><span class='country'>" + location.country + "</span></div></div>");
    }

    function sort_type(rows, type) {
        rows.sort(function(a, b) {
            var city_a = $(a).find("."+type).html().toLowerCase();
            var city_b = $(b).find("."+type).html().toLowerCase();
            
            if(type == 'default') {
                city_a = parseInt(city_a);
                city_b = parseInt(city_b);
            }

            var result = 0;
            if (city_a < city_b) {
                result = -1;
            }
            else if (city_a > city_b) {
                result = 1;
            }
            return result;
        });
        return rows;
    }

    function sort() {
        var select = $("#sort_list :selected").val();
        var rows = table.find('.row').detach();
        rows = sort_type(rows, select);
        table.append(rows);
    }

    function filter() { //����� �� ����� � �������
        var rows = $(".row").hide();
        var text = $(filter_input).val();

        rows.filter(function() {
            return $(this).find(".city").html().match(new RegExp(text, "i"));
        }).show();
    }
    
    function set_remove_btn_state() {
        var row_checked = table.find(".row.ui-selected");
        if (row_checked.length) {
            remove_btn.button("enable");
        }
        else {
            remove_btn.button("disable");
        }
    }

    var add_btn = $("#add");
    var remove_btn = $("#remove");
    var add_obj = $("#add_obj");
    var table = $("#location_list");
    var filter_input = $("#filter");
    var sort_list = $("#sort_list");

    add_btn.button({// �������� ������ add
        icons: {
            primary: "ui-icon-circle-plus"
        }
    });

    remove_btn.button({// �������� ������ remove
        icons: {
            primary: "ui-icon-circle-close"
        },
        disabled: true
    });

    add_btn.click(function() {// ��� ����� �������� ��������� ���� ��� ���������� ������/������
        $("#add_obj").dialog({
            resizable: false,
            modal: true,
            buttons: {
                Ok: function() {
                    var city = $("#city").val();
                    var country = $("#country").val();

                    if (city && country) {// if click ok, �� ��������� � ������� ����� �����
                        add_row(++maxId, {
                            city: city,
                            country: country
                        });
                        filter();
                        sort();
                        $(this).dialog("close");
                    }
                },
                Cancel: function() {
                    $(this).dialog("close");
                }
            }
        });
        add_obj.show();
    });

    remove_btn.click(function() {
        var row_checked = table.find(".row.ui-selected");
        row_checked.remove();
        set_remove_btn_state();
    });

    table.on("click", ".row", function(event) {
        var row = $(this).toggleClass("ui-selected");
        var checkbox = row.find("input[type=checkbox]");
        if ($(event.target).prop("type") != "checkbox") {
            checkbox.prop("checked", !checkbox.prop("checked"));
        }
        set_remove_btn_state();
    });

    filter_input.val("").keyup(function() {
        filter();
    });

    sort_list.val("default").change(function() {
        sort();
    });


    $.getJSON("locations.json", function(data) {
        create_table(data);
    });
});

