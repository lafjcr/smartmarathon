function LoadPage() {
    if (!$('#InKms').is(':checked')) {
        $('#btn-KM').toggleClass('btn-primary');
        $('#btn-MI').toggleClass('btn-primary');

        $('#InKms').val("false");
    }
    else
        $('#InKms').val("true");

    ShowSplits();
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

function LoadSplits() {
    var control = $('#Marathon');
    var selectedMarathon = control.val();
    var marathonInfo = selectedMarathon.split(';');

    if (marathonInfo != null && marathonInfo.length > 0) {
        var splitValuesK = marathonInfo[1].split(',');
        var splitValuesM = marathonInfo[2].split(',');

        $.each(splitValuesK, function (index, value) {
            var splitField = '#SplitsK_' + index + '__Category';
            $(splitField).val(value.trim());
        });

        $.each(splitValuesM, function (index, value) {
            var splitField = '#SplitsM_' + index + '__Category';
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