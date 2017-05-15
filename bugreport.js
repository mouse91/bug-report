function updateSyntax() {
    var desc = $('#desc-field').val();
    var expected = $('#exp-field').val();
    var actual = $('#act-field').val();
    var client = $('#client-field').val();
    var system = $('#sys-field').val();
    var steps = '';
    var bugtext = '';
    for (var i = 1; i <= window.sct; i++) {
        var step = $('#s' + i + '-field').val();
        if (step) {
            steps = steps + ' - ' + step;
        }
    }
    if (desc && expected && actual && client && system && steps) {
        bugtext = '!submit ' + desc + ' | Steps to Reproduce:' + steps + ' Expected Result: ' + expected + ' Actual Result: ' + actual + ' Client Settings: ' + client + ' System Settings: ' + system;
    }
    $('#syntax').text(bugtext);
}

function addStep() {
    window.sct++;
    var stxt = '<div class="input-group" id="s' + window.sct + '-grp"><span class="input-group-label"><small>Step ' + window.sct + '</small></span><input type="text" class="input-group-field" id="s' + window.sct + '-field"></div>';
    $('#steps-fs').append(stxt);
}

function removeStep() {
    if (window.sct > 1) {
        $('#s' + window.sct + '-grp').remove();
        window.sct--;
        updateSyntax();
    }
}

$(document).ready(function() {
    window.sct = 1;
    $(document).on('input', 'input[id*="-field"]', updateSyntax);
    $('#add-btn').on('click', addStep);
    $('#del-btn').on('click', removeStep);
    var cb = new Clipboard('#copy-btn', {
        text: function(trigger) {
            return $('#syntax').text();
        }
    });
    cb.on('success', function(e) {
        $(e.trigger).html('Copied');
        setTimeout(function() {
            $(e.trigger).html('Copy');
        }, 2000);
    });
});