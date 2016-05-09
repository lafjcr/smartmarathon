function LoadPage() {
    if (!$('#InKms').val()) {
        $('#btn-KM').toggleClass('btn-primary');
        $('#btn-MI').toggleClass('btn-primary');

        $('#InKms').val("false");
    }
    else
        $('#InKms').val("true");

    ShowSplits();

    return LoadLanguage();
}

function Submit(control) {
    $('#frmMain').submit();
}

function LoadEvents(url, distance) {
    var sendData = {
        distance: distance
    };
    var jqxhr = $.getJSON(url, sendData,
        function (data) {
            var select = $("#Marathon");
            select.empty();
            $.each(data, function (index, itemData) {
                select.append($('<option/>', {
                    value: itemData.Value,
                    text: itemData.Text,
                    selected: itemData.Selected
                }));
            });
        })
    .fail(function (error) {
        alert("[LoadEvents] Ajax Error");
    });
}

function InKms() {
    var inKms = $('#InKms').val() == "true";
    return inKms;
}

function ShowSplits() {
    var inKms = InKms();
    if (inKms) {
        $('#Miles').hide();
        $('#pacebymile-box').hide();
        $('#Kms').show();
        $('#pacebykm-box').show();
    }
    else {
        $('#Kms').hide();
        $('#pacebykm-box').hide();
        $('#Miles').show();
        $('#pacebymile-box').show();
    }
}

function BuildSplits(model, url) {
    model = JSON.stringify(model);
    var jqxhr = $.post(url, model,
        function (data) {
            $.each(data, function (index, itemData) {
                select.append($('<option/>', {
                    value: itemData.Value,
                    text: itemData.Text,
                    selected: itemData.Selected
                }));
            });
        })
    .fail(function (error) {
        alert("[LoadEvents] Ajax Error");
    });
}

function Refresh() {
    $('.btn-toggle').click();
    $('.btn-toggle').click();
    //LoadSplits();
}


function LoadSplits() {
    var control = $('#Marathon');
    var selectedMarathon = control.val();
    var marathonInfo = selectedMarathon.split(';');

    if (marathonInfo != null && marathonInfo.length > 0) {
        var splitValuesK = marathonInfo[1].split(',');
        var splitValuesM = marathonInfo[2].split(',');

        $.each(splitValuesK, function (index, value) {
            var splitField = '#Splits_Kilometers_' + index + '__Category';
            $(splitField).val(value.trim());
        });

        $.each(splitValuesM, function (index, value) {
            var splitField = '#Splits_Miles_' + index + '__Category';
            $(splitField).val(value.trim());
        });
    }
}

function ToggleKms(btn) {
    $(btn).find('.btn').toggleClass('active');

    if ($(btn).find('.btn-primary').size() > 0) {
        $(btn).find('.btn').toggleClass('btn-primary');
    }
    if ($(btn).find('.btn-danger').size() > 0) {
        $(btn).find('.btn').toggleClass('btn-danger');
    }
    if ($(btn).find('.btn-success').size() > 0) {
        $(btn).find('.btn').toggleClass('btn-success');
    }
    if ($(btn).find('.btn-info').size() > 0) {
        $(tbtn).find('.btn').toggleClass('btn-info');
    }

    $(btn).find('.btn').toggleClass('btn-default');


    //$('#InKms').trigger('click');

    var newValue = ! ($('#InKms').val() == "true");
    $('#InKms').val(newValue);

    ShowSplits();
}

function LoadLanguage() {
    var language = window.localStorage.Language;
    language = language == undefined ? $.cookie("Language") : language;
    if (language != undefined) {
        $('#Language').val(language);
    }
    SaveLanguage(language);
    return language;
}

function SaveLanguage(language) {
    $.cookie("Language", language, { expires: 365, path: '/' });
    window.localStorage.Language = language;
}


function ChangeLanguage(url, language) {
    $('#Language').val(language);
    SaveLanguage(language);
    window.location.href = url;

    //$('#frmLanguage').submit();

    //var sendData = $('#frmMain').serializeArray();
    //var jqxhr = $.post(url, sendData,
    //    function (data) {
    //        var newDoc = document.open("text/html", "replace");
    //        newDoc.write(data);
    //        newDoc.close();
    //    })
    //.fail(function (error) {
    //    alert("[ChangeLanguage] Ajax Error");
    //});
}

function SaveData(data) {
    window.localStorage.SmartMarathonData = data;
}

function CalculateGoalTimeAndAvgPaces(url, byGoalTime) {
    if (byGoalTime) {
        model = CreateAvgPacesModel();
    }
    else {
        model = CreateGoalTimeModel();
    }
    var jqxhr = $.post(url, model,
        function (data) {
            $('#PaceByKm_Minutes').val(data.PaceByKm.Minutes);
            $('#PaceByKm_Seconds').val(data.PaceByKm.Seconds);
            $('#PaceByMile_Minutes').val(data.PaceByMile.Minutes);
            $('#PaceByMile_Seconds').val(data.PaceByMile.Seconds);
            $('#GoalTime_Hours').val(data.GoalTime.Hours);
            $('#GoalTime_Minutes').val(data.GoalTime.Minutes);
            $('#GoalTime_Seconds').val(data.GoalTime.Seconds);
            Submit();
        })
    .fail(function (error) {
        alert("[CalculateGoalTimeAndAvgPaces] Ajax Error");
    });
}

function CreateAvgPacesModel() {
    var model = {
        InKms: InKms(),
        Distance: $("#Distance").val(),
        RealDistance: $("#RealDistance").val(),
        GoalTime: {
            "Hours": $('#GoalTime_Hours').val(),
            "Minutes": $('#GoalTime_Minutes').val(),
            "Seconds": $('#GoalTime_Seconds').val()
        }
    };
    return model;
}

function CreateGoalTimeModel() {
    var model = {
        InKms: InKms(),
        Distance: $("#Distance").val(),
        RealDistance: $("#RealDistance").val(),
        PaceByKm: {
            "Minutes": $('#PaceByKm_Minutes').val(),
            "Seconds": $('#PaceByKm_Seconds').val()
        },
        PaceByMile: {
            "Minutes": $('#PaceByMile_Minutes').val(),
            "Seconds": $('#PaceByMile_Seconds').val()
        }
    };
    return model;
}
