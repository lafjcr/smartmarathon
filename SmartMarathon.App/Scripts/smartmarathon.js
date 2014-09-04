function LoadPage() {
    if (!$('#InKms').val()) {
        $('#btn-KM').toggleClass('btn-primary');
        $('#btn-MI').toggleClass('btn-primary');

        $('#InKms').val("false");
    }
    else
        $('#InKms').val("true");

    ShowSplits();
}

function Submit() {
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
            //select.append($('<option/>', {
            //    value: 0,
            //    text: "Select a Class"
            //}));
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


function ShowSplits() {
    var inKms = $('#InKms').val() == "true";
    if (inKms) {
        $('#Kms').show();
        $('#Miles').hide();
    }
    else {
        $('#Kms').hide();
        $('#Miles').show();
    }
}

function BuildSplits(model, url) {
    model = JSON.stringify(model);
    var jqxhr = $.post(url, model,
        function (data) {
            //var select = $("#Marathon");
            //select.empty();
            //select.append($('<option/>', {
            //    value: 0,
            //    text: "Select a Class"
            //}));
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