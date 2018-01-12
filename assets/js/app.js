$('#DCbtn').data('DCremoval', 1);
$('#_60Hz').data("_60Hz", 0);
$('#_50Hz').data("_50Hz", 0);
$('#refrential').data('refrentialCh', 0);
$('#invert').data('invertCh', 1);
$('.window1s').data('windowduration', 1);
$('.window3s').data('windowduration', 3);
$('.window7s').data('windowduration', 7);
$('.window10s').data('windowduration', 10);
$('.window15s').data('windowduration', 15);
$('.window30s').data('windowduration', 30);
$('.window60s').data('windowduration', 60);
$('#windowduratin').data('window_duration', 7);
$("#channel_labels_one").data('chlist', []);
$("#montage_EEG_list").data('montage', []);
$("#montage_EKG_list").data('montage', []);
$("#montage_other_list").data('montage', []);
$("#montage").data('plotMontage', 1);
$('.amp1s').data('amplitudeCalibration', 1);
$('.amp2s').data('amplitudeCalibration', 2);
$('.amp3s').data('amplitudeCalibration', 3);
$('.amp5s').data('amplitudeCalibration', 5);
$('.amp7s').data('amplitudeCalibration', 7);
$('.amp10s').data('amplitudeCalibration', 10);
$('.amp15s').data('amplitudeCalibration', 15);
$('.amp20s').data('amplitudeCalibration', 20);
$('.amp30s').data('amplitudeCalibration', 30);
$('.amp50s').data('amplitudeCalibration', 50);
$('.amp100s').data('amplitudeCalibration', 100);
$('#amp').data('amplitudeCalibration', 5);
$('#GO').data('tab', 1);
$('#montage').data('montageCode', 'm1');
$('.Montage1').data('montageNum', 1);
$('.Montage2').data('montageNum', 2);
$('.Montage3').data('montageNum', 3);
$('.Montage4').data('montageNum', 4);
$('.Montage5').data('montageNum', 5);
$('.Montage6').data('montageNum', 6);
$('.annotaionHeader').data('sortOrder', 'asc');
$('#Annotaion_Table_Head_0').data('col', 0);
$('#Annotaion_Table_Head_1').data('col', 1);
$('#annotaionsTableScrol').css('height', ($(window).height() - 222));
$('#setting_CNW_slider').data('position', 0);
var ch_dic = {};
var edf = {};

var montage = {
    'm1': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
    'm2': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
    'm3': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
    'm4': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
    'm5': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
    'm6': {
        'EEG': [],
        'EKG': [],
        'Other': [],
    },
};
var settings = {
    'channelWidth': 150,
    'AlwaysShowAnnotaionsTable': 1,
    'EDFplusAnnotaionsTable': 1,
};
$('#aboutbtn').click(function() {
    $('#aboutmodal').modal('show');
});
$('#Documentationbtn').click(function() {
    window.open('https://bilalzonjy.github.io/doc/EDFViewer/doc.html', '_blank');
});

function sizeChanged(argument) {
    if (edf.fileName) {
        $("#montage").data('plotMontage', 1);
        plot_table_width_rearrange();
        readEEG();
    }
}

function scroll_marker_width_manager() {
    const window_duration = $('#windowduratin').data("window_duration");
    var scroll_marker_width = (parseFloat($('#rangeinput').width()) * parseFloat($('#windowduratin').data("window_duration"))) / edf.file_duration;
    if (scroll_marker_width < 3) {
        scroll_marker_width = 3
    };
    $('#scroll_marker').css('width', scroll_marker_width);
}

$('#startWindowtime').click(function() {
    try {
        var datetime = edf.date_time.clone()
        datetime = datetime.format("YYYY-MM-DD");
        var endTimedatetime = edf.date_time.clone();
        endTimedatetime.add(edf.file_duration, 'seconds');
        endTimedatetime = endTimedatetime.format("YYYY-MM-DD");
        if (moment(endTimedatetime).isSame(datetime)) {
            $('#date_Clock').hide();
        } else {
            $('#date_Clock').show();
            $('#date_Clock').css('max', endTimedatetime);
            $('#date_Clock').css('min', datetime);
        }
        datetime = edf.date_time.clone();
        var t_beg = edf.t_beg;
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#date_Clock').val(st_date_time.format("YYYY-MM-DD"));
        $('#HH_Clock').val(st_date_time.format("HH"));
        $('#mm_Clock').val(st_date_time.format("mm"));
        $('#ss_Clock').val(st_date_time.format("ss"));
        $('#ClockTimeli').click(function() {
            $('#GO').data('tab', 1);
        });
        $('#ElapsTimeli').click(function() {
            $('#GO').data('tab', 2);
        });
        $('#Elapssecondsli').click(function() {
            $('#GO').data('tab', 3);
        });
        var totalSeconds = t_beg;
        var hours = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        var minutes = Math.floor(totalSeconds / 60);
        var seconds = totalSeconds % 60;
        $('#HH_Elaps').val(hours);
        $('#mm_Elaps').val(minutes);
        $('#ss_Elaps').val(seconds);
        $('#seconds_Elaps').val(t_beg);
        $('#seconds_Elaps').css('max', edf.file_duration - 1);
        edf.jumptomodal = 1;
        $('#jumptomodal').modal('show');
    } catch (err) {};
});

$('.amplitSelect').click(function() {
    if (edf.ampAutoChanging == 1) {
        return
    };
    var amp = $(this).data('amplitudeCalibration');
    $('#amp').data("amplitudeCalibration", amp);
    $('#ampNumber').text(amp + ' µV ');
    if (edf.fileName) {
        readEEG();
    };
});

$('.HH').on('input', function() {
    if ($(this).val() > 23) {
        $(this).val(23);
    } else if ($(this).val() < 0) {
        $(this).val(0);
    }
});
$('.60').on('input', function() {
    if ($(this).val() > 59) {
        $(this).val(59);
    } else if ($(this).val() < 0) {
        $(this).val(0);
    }
});
$('.seconds').on('input', function() {
    if (edf.file_duration) {
        try {
            if ($(this).val() > edf.file_duration - 1) {
                $(this).val(edf.file_duration - 1);
            } else if ($(this).val() < 0) {
                $(this).val(0);
            }
        } catch (err) {}
    } else {
        $(this).val(0);
    }
});

$('#GO').click(function() {
    jumpto_modal_go_activate();

});

function jumpto_modal_go_activate() {
    var tab = $('#GO').data('tab');
    const window_duration = parseInt($('#windowduratin').data("window_duration"));
    if (tab == 1) {
        var datetime = edf.date_time.clone();
        var endTimedatetime = edf.date_time.clone();
        endTimedatetime = endTimedatetime.add(edf.file_duration, 'seconds');
        var enteredClock = moment($('#date_Clock').val() + '-' + $('#HH_Clock').val() + '-' + $('#mm_Clock').val() + '-' + $('#ss_Clock').val(), "YYYY-MM-DD-HH-mm-ss");
        if (enteredClock.diff(endTimedatetime, 'seconds') < -1) {
            var t_mid = enteredClock.diff(datetime, 'seconds');
            if (t_mid >= 0) {
                var t_beg = t_mid - Math.floor(window_duration / 2);
                if (t_beg < 0) {
                    t_beg = 0
                };
                if (t_beg + window_duration > edf.file_duration - 1) {
                    t_beg = edf.file_duration - window_duration - 1
                };
                edf.t_beg = parseInt(t_beg);
                edf.jump_point = t_mid;
                edf.jumptomodal = 0;
                $('#jumptomodal').modal('hide');
                Jump();
            } else {
                alert('File begins at ' + datetime.format("YYYY-MM-DD HH:mm:ss") + '\nPlease enter a valid time')
            }
        } else {
            alert('File ends at ' + endTimedatetime.format("YYYY-MM-DD HH:mm:ss") + '\nPlease enter a valid time')
        }
    } else if (tab == 2) {
        var t_mid = parseInt($('#HH_Elaps').val()) * 3600 + parseInt($('#mm_Elaps').val()) * 60 + parseInt($('#ss_Elaps').val());

        if (edf.file_duration > (t_mid - 1)) {
            var t_beg = t_mid - Math.floor(window_duration / 2);
            if (t_beg < 0) {
                t_beg = 0
            };
            if (t_beg + window_duration > edf.file_duration - 1) {
                t_beg = edf.file_duration - window_duration - 1;
            };

            edf.t_beg = parseInt(t_beg);
            edf.jump_point = t_mid;

            edf.jumptomodal = 0;
            $('#jumptomodal').modal('hide');
            Jump();
        } else {
            totalSeconds = edf.file_duration;
            var hours = Math.floor(totalSeconds / 3600);
            totalSeconds %= 3600;
            var minutes = Math.floor(totalSeconds / 60);
            var seconds = totalSeconds % 60;
            alert("File's duration is \n" + hours + ' hour ' + minutes + ' minutes ' + seconds + ' seconds ' + '\nPlease enter a valid time');
        }
    } else if (tab == 3) {
        var t_mid = parseInt($('#seconds_Elaps').val());
        if (edf.file_duration > (t_mid - 1)) {
            var t_beg = t_mid - Math.floor(window_duration / 2);
            if (t_beg < 0) {
                t_beg = 0
            };
            if (t_beg + window_duration > edf.file_duration - 1) {
                t_beg = edf.file_duration - window_duration - 1
            };
            edf.t_beg = parseInt(t_beg);
            edf.jump_point = t_mid;
            edf.jumptomodal = 0;
            $('#jumptomodal').modal('hide');
            Jump();
        } else {
            alert("File's duration is " + edf.file_duration - 1 + ' seconds ' + '\nPlease enter a valid number');
        }
    }
}

$('#jumptomodal').on('hidden.bs.modal', function() {
    edf.jumptomodal = 0;
})

$(document).on('input', '#rangeinput', function() {
    $('#rangeinput').blur();
    var change = Math.abs(edf.t_beg - parseInt($(this).val()));
    if (change > parseInt($('#windowduratin').data("window_duration"))) {
        edf.t_beg = parseInt($(this).val());
        Jump();
        return;
    } else {
        if (edf.t_beg > parseInt($(this).val())) {
            previousPage();
            return;
        } else {
            nextPage();
            return;
        }

    }
});

function Jump() {
    $('#rangeinput').blur();
    const window_duration = parseInt($('#windowduratin').data("window_duration"));
    var t_beg = parseInt(edf.t_beg);
    var end = parseInt(edf.file_duration);
    var t_end = t_beg + window_duration;
    if (t_end >= end - 1) {
        t_beg = end - window_duration;
    }
    edf.t_beg = parseInt(t_beg);
    t_end = t_beg + window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    if (edf.fileName) {
        readEEG();
    };
}

var keepRunning = 0;
document.onkeydown = function(e) {
    $('#rangeinput').blur();
    var key = e.which || e.keyCode;
    if (edf.plotting == 0) {
        if (key == 37) {
            keepRunning = 0;
            edf.plotting = 1;
            setTimeout(function() {
                previousPage();
            }, 500);
        } else if (key == 38) {
            var amp = $('#amp').data('amplitudeCalibration');
            var ampList = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 100];
            var ampind = ampList.indexOf(amp);
            if (ampind > 0) {
                amp = ampList[ampind - 1];
                edf.ampAutoChanging = 1;
                $('#amp').data('amplitudeCalibration', amp);
                $('.amplitSelect').prop("checked", false);
                $('#ampNumber').text(amp + ' µV ');
                $('.amp' + amp + 's').prop("checked", true);
                edf.ampAutoChanging = 0;
                if (edf.fileName) {
                    readEEG();
                };
            }
        } else if (key == 39) {
            keepRunning = 0;
            edf.plotting = 1;
            setTimeout(function() {
                nextPage();
            }, 500);
        } else if (key == 40) {
            var amp = $('#amp').data('amplitudeCalibration');
            var ampList = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 100];
            var ampind = ampList.indexOf(amp);
            if (ampind < ampList.length - 1) {
                amp = ampList[ampind + 1];
                edf.ampAutoChanging = 1;
                $('#amp').data('amplitudeCalibration', amp);
                $('.amplitSelect').prop("checked", false);
                $('#ampNumber').text(amp + ' µV ');
                $('.amp' + amp + 's').prop("checked", true);
                edf.ampAutoChanging = 0;
                if (edf.fileName) {
                    readEEG();
                };
            }
        } else if (key == 32) {
            if (keepRunning == 0) {
                keepRunning = 1;
                RunPageForward();
            } else {
                keepRunning = 0;
            }
        } else if (key == 13) {
            if (edf.jumptomodal == 1) {
                jumpto_modal_go_activate();
            }

        } else if (key == 49 && edf.jumptomodal != 1) {
            // montage 1
            change_montage_through_num('1');
        } else if (key == 50 && edf.jumptomodal != 1) {
            // montage 2
            change_montage_through_num('2');
        } else if (key == 51 && edf.jumptomodal != 1) {
            // montage 3
            change_montage_through_num('3');
        } else if (key == 52 && edf.jumptomodal != 1) {
            // montage 4
            change_montage_through_num('4');
        } else if (key == 53 && edf.jumptomodal != 1) {
            // montage 5
            change_montage_through_num('5');
        } else if (key == 54 && edf.jumptomodal != 1) {
            // montage 6
            change_montage_through_num('6');
        }

    }
};

function change_montage_through_num(num) {
    if (edf.montageEdit != 1) {
        $('#general_montage_num').text(num);
        $('#montage_modal_txt').text(' Montage ' + num);
        $('#montage').data('montageCode', 'm' + num);
        $('.Montage' + num).prop("checked", true);
        if (edf.fileName) {
            $("#montage").data('plotMontage', 1);
            readEEG();
        };

    }
}

function RunPageForward() {
    if (parseInt(edf.t_beg) + parseInt($('#windowduratin').data("window_duration")) < parseInt(edf.file_duration) - 1) {
        edf.plotting = 1;
        nextPage();
    } else {
        keepRunning = 0;
    };
    if (keepRunning == 1) {
        setTimeout(RunPageForward, 500);
    }
};

$('#DCbtn').click(function() {
    if ($(this).data('DCremoval') == 1) {
        $(this).data("DCremoval", 0);
        $(this).css('aria-pressed', 'false');
        $('#CDspan').removeClass('glyphicon-check');
        $('#CDspan').addClass('glyphicon-unchecked');
        if (edf.fileName) {
            readEEG();
        };
    } else {
        $(this).data("DCremoval", 1);
        $(this).css('aria-pressed', 'true');
        $('#CDspan').removeClass('glyphicon-unchecked');
        $('#CDspan').addClass('glyphicon-check');
        if (edf.fileName) {
            readEEG();
        };
    }
});

$('#_60Hz').click(function() {
    if ($(this).data('_60Hz') == 1) {
        $(this).data("_60Hz", 0);
        $(this).css('aria-pressed', 'false');
        $('#60span').removeClass('glyphicon-check');
        $('#60span').addClass('glyphicon-unchecked');
        if (edf.fileName) {
            readEEG();
        };
    } else {
        $(this).data("_60Hz", 1);
        $(this).css('aria-pressed', 'true');
        $('#60span').removeClass('glyphicon-unchecked');
        $('#60span').addClass('glyphicon-check');
        if (edf.fileName) {
            readEEG();
        };
    }
});

$('#_50Hz').click(function() {
    if ($(this).data('_50Hz') == 1) {
        $(this).data("_50Hz", 0);
        $(this).css('aria-pressed', 'false');
        $('#50span').removeClass('glyphicon-check');
        $('#50span').addClass('glyphicon-unchecked');
        if (edf.fileName) {
            readEEG();
        };
    } else {
        $(this).data("_50Hz", 1);
        $(this).css('aria-pressed', 'true');
        $('#50span').removeClass('glyphicon-unchecked');
        $('#50span').addClass('glyphicon-check');
        if (edf.fileName) {
            readEEG();
        };
    }
});
$('#refrential').click(function() {
    if ($(this).data('refrentialCh') == 1) {
        $(this).data("refrentialCh", 0);
        $(this).css('aria-pressed', 'false');
        $('.channel2Group').css('visibility', 'visible');
        $('#refrentialspan').removeClass('glyphicon-check');
        $('#refrentialspan').addClass('glyphicon-unchecked');
    } else {
        $(this).data("refrentialCh", 1);
        $(this).css('aria-pressed', 'true');
        $('.channel2Group').css('visibility', 'hidden');
        $('#refrentialspan').removeClass('glyphicon-unchecked');
        $('#refrentialspan').addClass('glyphicon-check');
    }
});
$('#invert').click(function() {
    if ($(this).data('invertCh') == 1) {
        $(this).data("invertCh", -1);
        $(this).css('aria-pressed', 'true');
        $('#invertspan').removeClass('glyphicon-unchecked');
        $('#invertspan').addClass('glyphicon-check');
    } else {
        $(this).data("invertCh", 1);
        $(this).css('aria-pressed', 'false');
        $('#invertspan').removeClass('glyphicon-check');
        $('#invertspan').addClass('glyphicon-unchecked');
    }
});
$('.windowSelect').click(function() {
    try {
        var duration = $(this).data('windowduration');
        $('#windowduratin').data("window_duration", duration);
        $('#wd').text(duration + 's ');
        scroll_marker_width_manager();
        var t_beg;
        if (edf.choosenAnnotation) {
            var t_mid = edf.choosenAnnotation[1];
            t_beg = t_mid - Math.floor(duration / 2);
            if (t_beg < 0) {
                t_beg = 0
            };
            if (t_beg + duration > edf.file_duration - 1) {
                t_beg = edf.file_duration - duration - 1
            };

        } else {
            t_beg = edf.t_beg;
        }

        var end = edf.record_duration * edf.records_count;
        var t_end = t_beg + duration;
        if (t_end >= end - 1) {
            t_beg = end - duration;
        }
        edf.t_beg = parseInt(t_beg);
        t_end = parseInt(t_beg) + duration;
        var datetime = edf.date_time.clone();
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
        $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
        datetime = edf.date_time.clone();
        var end_date_time = datetime.add(t_end, 'seconds');
        $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
        if (edf.fileName) {
            readEEG();
        };
    } catch (err) {};
});

$(window).scroll(function() {
    $('#montageMiddle').css('top', $(this).scrollTop());
});
$('#next_page').on('click', function() {
    nextPage();
})
$('#next_sec').on('click', function() {
    try {
        const window_duration = $('#windowduratin').data("window_duration");
        var t_beg = edf.t_beg + 1;
        var end = edf.record_duration * edf.records_count;
        var t_end = t_beg + window_duration;
        if (t_end >= end - 1) {
            t_beg = end - window_duration;
        }
        edf.t_beg = parseInt(t_beg);
        t_end = edf.t_beg + window_duration;
        var datetime = edf.date_time.clone();
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
        $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
        datetime = edf.date_time.clone();
        var end_date_time = datetime.add(t_end, 'seconds');
        $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
        readEEG();
    } catch (err) {};
})
$('#previous_sec').on('click', function() {
    try {
        const window_duration = $('#windowduratin').data("window_duration");
        var t_beg = edf.t_beg - 1;
        var end = edf.record_duration * edf.records_count;
        var t_end = edf.t_beg;
        if (t_beg < 0) {
            t_beg = 0;
        }
        edf.t_beg = parseInt(t_beg);
        t_end = edf.t_beg + window_duration;
        var datetime = edf.date_time.clone();
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
        $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
        datetime = edf.date_time.clone();
        var end_date_time = datetime.add(t_end, 'seconds');
        $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
        readEEG();
    } catch (err) {};
})

$('#previous_page').on('click', function() {
    previousPage();
})

function nextPage() {
    try {
        const window_duration = $('#windowduratin').data("window_duration");
        var t_beg = edf.t_beg + window_duration;

        var end = edf.record_duration * edf.records_count;
        var t_end = t_beg + window_duration;
        if (t_end >= end - 1) {
            t_beg = end - window_duration;
        }
        edf.t_beg = parseInt(t_beg);
        t_end = edf.t_beg + window_duration;
        var datetime = edf.date_time.clone();
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
        $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
        datetime = edf.date_time.clone();
        var end_date_time = datetime.add(t_end, 'seconds');
        $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
        readEEG();
    } catch (err) {};
}

function previousPage() {
    try {
        const window_duration = $('#windowduratin').data("window_duration");
        var t_beg = edf.t_beg - window_duration;
        var end = edf.record_duration * edf.records_count;
        var t_end = edf.t_beg;
        if (t_beg < 0) {
            t_beg = 0;
        }
        edf.t_beg = parseInt(t_beg);
        t_end = edf.t_beg + window_duration;
        var datetime = edf.date_time.clone();
        var st_date_time = datetime.add(t_beg, 'seconds');
        $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
        $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
        datetime = edf.date_time.clone();
        var end_date_time = datetime.add(t_end, 'seconds');
        $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
        readEEG();
    } catch (err) {};
}

function analysis_header(e) {
    if (!e.target.files[0]) {
        return;
    };
    ch_dic = {};
    edf = {};
    edf.fileName = e.target.files[0];

    $("#EEGMontage").data('ch1', null);
    $("#EEGMontage").data('ch2', null);
    $("#EKGMontage").data('ch1', null);
    $("#EKGMontage").data('ch2', null);
    $("#OtherMontage").data('ch1', null);
    $("#OtherMontage").data('ch2', null);
    $("#EEGDiv").remove();
    $("#EKGDiv").remove();
    $("#otherDiv").remove();
    $('.ChDiv').remove();
    $("#UpperTimeMarkDiv").remove();
    $("#LowerTimeMarkDiv").remove();
    $('#EEGchName').css('height', 0);
    $('#EKGchName').css('height', 0);
    $('#otherchName').css('height', 0);
    $('#UpperTimeMarkName').css('height', 0);
    $('#LowerTimeMarkName').css('height', 0);
    $('.RowTwoPlot').css('visibility', 'hidden');
    $('.FirstCol').css('borderRightWidth', 0);
    $('.SecondCol').css('borderRightWidth', 0);
    $("#montage").data('plotMontage', 1);
    $('#SearchInput').val('');

    read_Header()
        .then(Analysis_Header_First_Section)
        .then(Analysis_Header_Second_Section)
        .then(ReadAnnotatons);
}

function read_Header() {
    return new Promise(function(resolve, reject) {
        var start = 8;
        var stop = 256;
        var file = edf.fileName;
        var reader = new FileReader();
        var blob = file.slice(start, stop);
        reader.readAsBinaryString(blob);
        return reader.onloadend = function() {
            var data = reader.result;
            resolve(data);
        };
    });
}

function Analysis_Header_First_Section(data) {
    return new Promise(function(resolve, reject) {
        edf.local_patient_id = data.slice(0, 80).trim();
        edf.local_recording_id = data.slice(80, 160).trim();
        edf.start_date = data.slice(160, 168).trim();
        edf.start_time = data.slice(168, 176).trim();
        edf.header_bytes_count = parseFloat(data.slice(176, 184).trim());
        edf.reserved = data.slice(184, 228).trim();
        edf.records_count = parseFloat(data.slice(228, 236).trim());
        edf.record_duration = parseFloat(data.slice(236, 244).trim());
        try {
            $('#ptname').text(edf.local_recording_id);
        } catch (err) {
            $('#ptname').text(' ');
        }
        var year = parseFloat(edf.start_date.slice(6));
        if (year >= 85) {
            year = 1900 + year;
        } else {
            year = 2000 + year;
        }
        edf.date_time = moment(edf.start_date.slice(0, 2) + '-' + edf.start_date.slice(3, 5) + '-' + year + ' ' + edf.start_time.replace('.', ':'), "DD-MM-YYYY HH:mm:ss")
        $('#DateTime').text(edf.date_time.format("YYYY-MM-DD"));
        var window_dur = $('#windowduratin').data("window_duration");
        $('#startWindowtime').text(edf.date_time.format("HH:mm:ss"));
        var endwindow = edf.date_time.clone();
        endwindow = endwindow.add(window_dur, 'seconds');
        $('#endWindowtime').text(endwindow.format("HH:mm:ss"));
        edf.t_beg = 0;
        edf.file_duration = edf.records_count * edf.record_duration;
        $('#rangeinput').attr('max', edf.file_duration);

        resolve(data);
    });
}

function Analysis_Header_Second_Section(data) {
    return new Promise(function(resolve, reject) {
        var start = 250;
        var stop = edf.header_bytes_count;
        stop++;
        var file = edf.fileName;
        var reader = new FileReader();
        var blob = file.slice(start, stop);
        reader.readAsBinaryString(blob);
        return reader.onloadend = function() {
            var data = reader.result.trim();
            var pointer = 4;
            var ch_samp_offsets = 0;
            var samples_per_record = 0;
            edf.channels_count = parseFloat(data.slice(0, pointer).trim());
            pointer = analysis_header_ch(data, 'channel_labels', 16, pointer);
            pointer = analysis_header_ch(data, 'channel_trans', 80, pointer);
            pointer = analysis_header_ch(data, 'channel_units', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_phys_minimums', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_phys_maximums', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_dig_minimums', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_dig_maximums', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_prefilterings', 80, pointer);
            pointer = analysis_header_ch(data, 'channel_samples_per_record', 8, pointer);
            pointer = analysis_header_ch(data, 'channel_reserved', 32, pointer);
            var channelslist = $("#channel_labels_one").data('chlist');
            edf.keepmontage = 0;

            const choosenMontage = montage[$('#montage').data('montageCode')];
            const montage_EEG_list = choosenMontage['EEG']
            const montage_EKG_list = choosenMontage['EKG']
            const montage_other_list = choosenMontage['Other']

            edf['Annotations'] = {};
            $('.annotation_row').remove();

            if (edf.channel_labels.includes("EDF Annotations")) {

                edf['Annotations'].read_annotaion = 1;

            } else {
                edf['Annotations'].read_annotaion = 0;
            }

            if (montage_EEG_list.length > 0 || montage_EKG_list.length > 0 || montage_other_list.length > 0) {
                edf.keepmontage = 1;
            }
            $('#montagbtngroup').css('height', 360);
            $('.montageWindowName').remove();
            $("#channel_labels_one").data('chlist', edf.channel_labels);
            $("#montage_EEG_list").data('montage', []);
            $("#montage_EKG_list").data('montage', []);
            $("#montage_other_list").data('montage', []);
            $('.montageall').remove();
            $("#montage").data('plotMontage', 1);
            $(".ChDiv").remove();

            var ht = $('#montagbtngroup').height();
            var li, Chlbl, Chlb2;
            for (i in edf.channel_labels) {
                if (edf.channel_labels[i] != '' && edf.channel_labels[i] != "EDF Annotations") {

                    li = $('<li style="padding: 0px; margin:0px;" class="montageWindowName"></li>');
                    li.css('margin-top', 5);
                    li.css('margin-bottom', 5);
                    if (i == 0) {
                        Chlbl = $('<label class="btn btn-success montageChannel_1 montageWindowName" style="padding: 0px; margin:0px;"><input class="montageChannel_1" type="radio" name="ch1"  autocomplete="off" checked>' + edf.channel_labels[i] + '</label>');
                        Chlbl.data('checked', 'true');
                        $("#EEGMontage").data('ch1', edf.channel_labels[i]);
                        $("#EKGMontage").data('ch1', edf.channel_labels[i]);
                        $("#OtherMontage").data('ch1', edf.channel_labels[i]);
                    } else {
                        Chlbl = $('<label class="btn btn-success montageChannel_1 montageWindowName" style="padding: 0px; margin:0px;"><input class="montageChannel_1" type="radio" name="ch1"  autocomplete="off">' + edf.channel_labels[i] + '</label>');
                        Chlbl.data('checked', 'false');
                    };
                    Chlbl.data('ch', edf.channel_labels[i]);
                    Chlbl.css('width', 135);
                    Chlbl.css('height', 30);
                    Chlbl.css('padding-left', 0);
                    Chlbl.css('text-align', 'left');
                    Chlbl.css('padding-top', 5);
                    if (edf.channel_labels[i].length > 13) {
                        Chlbl.css('font-size', 11);
                    } else {
                        Chlbl.css('font-size', 13);
                    };
                    li.append(Chlbl);
                    $('#channel_labels_one').append(li);
                    li = $('<li style="padding: 0px; margin:0px;" class="montageWindowName"></li>');
                    li.css('margin-top', 5);
                    li.css('margin-bottom', 5);

                    if (i == 0) {
                        Chlb2 = $('<label class="btn btn-success montageChannel_2 montageWindowName"style="padding: 0px; margin:0px;"><input class="montageChannel_2" type="radio" name="ch2" autocomplete="off" checked>' + edf.channel_labels[i] + '</label>')
                        Chlb2.data('checked', 'true');
                        $("#EEGMontage").data('ch2', edf.channel_labels[i]);
                        $("#EKGMontage").data('ch2', edf.channel_labels[i]);
                        $("#OtherMontage").data('ch2', edf.channel_labels[i]);
                    } else {
                        Chlb2 = $('<label class="btn btn-success montageChannel_2 montageWindowName"style="padding: 0px; margin:0px;"><input class="montageChannel_2" type="radio" name="ch2" autocomplete="off">' + edf.channel_labels[i] + '</label>')
                        Chlb2.data('checked', 'false');
                    };
                    Chlb2.data('ch', edf.channel_labels[i]);
                    Chlb2.css('width', 135);
                    Chlb2.css('height', 30);
                    Chlb2.css('padding-left', 0);
                    Chlb2.css('text-align', 'left');
                    Chlb2.css('padding-top', 5);
                    if (edf.channel_labels[i].length > 13) {
                        Chlb2.css('font-size', 11);
                    } else {
                        Chlb2.css('font-size', 13);
                    };
                    li.append(Chlb2);
                    $('#channel_labels_two').append(li);

                };
                ch_dic[edf.channel_labels[i]] = {
                    channel_trans: edf.channel_trans[i],
                    channel_units: edf.channel_units[i],
                    channel_phys_minimums: parseFloat(edf.channel_phys_minimums[i]),
                    channel_phys_maximums: parseFloat(edf.channel_phys_maximums[i]),
                    channel_dig_minimums: parseFloat(edf.channel_dig_minimums[i]),
                    channel_dig_maximums: parseFloat(edf.channel_dig_maximums[i]),
                    channel_prefilterings: edf.channel_prefilterings[i],
                    channel_samples_per_record: parseFloat(edf.channel_samples_per_record[i]),
                    channel_reserved: edf.channel_reserved[i],
                    channel_sample_rates: parseFloat(edf.channel_samples_per_record[i]) / edf.record_duration,
                    channel_samples_count: parseFloat(edf.channel_samples_per_record[i]) * edf.records_count,
                    channel_physical_ranges: parseFloat(edf.channel_phys_maximums[i]) - parseFloat(edf.channel_phys_minimums[i]),
                    channel_digital_ranges: parseFloat(edf.channel_dig_maximums[i]) - parseFloat(edf.channel_dig_minimums[i]),
                    channel_scaling_factors: (parseFloat(edf.channel_phys_maximums[i]) - parseFloat(edf.channel_phys_minimums[i])) / (parseFloat(edf.channel_dig_maximums[i]) - parseFloat(edf.channel_dig_minimums[i])),
                    channel_block_samples_offset: ch_samp_offsets,
                    channel_block_bytes_offset: 2 * ch_samp_offsets,
                };
                ch_samp_offsets = ch_samp_offsets + parseFloat(edf.channel_samples_per_record[i]);
                samples_per_record = samples_per_record + parseFloat(edf.channel_samples_per_record[i]);
            }
            edf.samples_per_record = samples_per_record;
            edf.bytes_per_record = 2 * samples_per_record;
            var channel_record_onset = edf.channel_samples_per_record;
            edf.channel_record_onset = [0];
            for (i in channel_record_onset) {
                edf.channel_record_onset.push(parseFloat(channel_record_onset[i]));
            }
            i = 1;
            while (i < edf.channel_record_onset.length) {
                edf.channel_record_onset[i] = edf.channel_record_onset[i - 1] + edf.channel_record_onset[i];
                i++;
            }
            var channel_record_end = edf.channel_record_onset.slice(1);
            channel_record_end.push(edf.samples_per_record);
            edf.channel_record_end = channel_record_end;
            i = 0;
            edf.records_start = [];
            var bytes_offset = edf.header_bytes_count;
            while (i < edf.records_count) {
                edf.records_start.push(bytes_offset);
                bytes_offset = bytes_offset + edf.bytes_per_record;
                i++;
            }
            for (i in edf.channel_labels) {
                ch_dic[edf.channel_labels[i]]['bytes_per_record_skip'] = 2 * (samples_per_record - ch_dic[edf.channel_labels[i]].channel_samples_per_record);
            }
            ht = $('#montagbtngroup').height();
            $('#montagbtngroup').css('height', ht - 40);
            loadoSettings();
            plot_table_width_rearrange();
            $('#scroll_marker').css('left', '0');
            resolve(ch_dic);
        };
    });
}

function analysis_header_ch(data, ID, bytesnumber, pointer) {
    edf[ID] = [];
    var CH_index = 0;
    var point = pointer
    while (CH_index < edf.channels_count) {
        var start = point;
        var stop = start + bytesnumber;
        CH_index++;
        point = stop
        var ch = data.slice(start, stop).trim()
        edf[ID].push(ch);
    }
    return (point);
}

function ReadAnnotatons() {
    if (edf['Annotations'].read_annotaion == 1) {
        $("body").css("cursor", "progress");
        $("#loadAnnotationModule").modal("show");
        edf.Annotations.annotaion_record_reading = 0;
        edf.Annotations.annotations_list = [];
        edf.Annotations.channel_block_start = edf.header_bytes_count - 1 + ch_dic["EDF Annotations"].channel_block_bytes_offset + edf.Annotations.annotaion_record_reading * edf.bytes_per_record;
        $('.AnnotaionsRow').remove();
        ReadSegmentAnnotatons();
    } else {

        $('.AnnotaionsRow').remove();
        Assess_montage();
    }

}

function ReadSegmentAnnotatons() {
    var buf, anno_box, anno_box_ind, array8, anno, anno_start, duration_start, anno_onset, duration, anno_text, annotaion_row, annotaion_text, annotation_time, ID;
    var channel_bytes_per_record = ch_dic["EDF Annotations"].channel_samples_per_record * 2;
    var end = edf.Annotations.channel_block_start + channel_bytes_per_record;
    var block = [];
    var blob = edf.fileName.slice(edf.Annotations.channel_block_start, end);
    var reader = new FileReader();
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function() {
        edf.Annotations.annotaion_record_reading = edf.Annotations.annotaion_record_reading + 1;
        edf.Annotations.channel_block_start = edf.header_bytes_count - 1 + ch_dic["EDF Annotations"].channel_block_bytes_offset + edf.Annotations.annotaion_record_reading * edf.bytes_per_record;
        buf = reader.result;
        array8 = new Uint8Array(buf);
        for (_ in array8) {
            block.push(parseFloat(array8[_]))
        }
        anno_box = [];
        for (var _ = 0; _ < block.length - 1; _++) {
            if (block[_] == 20 && block[_ + 1] == 0) {
                anno_box.push(_);
            };
        };
        anno_box_ind = [];
        for (var _ = 0; _ < anno_box.length - 1; _++) {
            anno_box_ind.push([anno_box[_], anno_box[_ + 1]])
        };
        for (_ in anno_box_ind) {
            anno = block.slice(anno_box_ind[_][0] + 2, anno_box_ind[_][1]);
            anno_start = anno.indexOf(20);
            if (anno.includes(21)) {
                duration_start = anno.indexOf(21);
                anno_onset = String.fromCharCode.apply(null, anno.slice(1, duration_start));
                anno_onset = parseFloat(anno_onset);
                duration = String.fromCharCode.apply(null, anno.slice(duration_start + 1, anno_start));
                duration = parseFloat(duration);
            } else {
                anno_onset = String.fromCharCode.apply(null, anno.slice(1, anno_start));
                anno_onset = parseFloat(anno_onset);
                duration = 0;
            }

            anno_text = String.fromCharCode.apply(null, anno.slice(anno_start + 1, ));
            ID = generagteIDCode(anno_text, anno_onset, duration);
            edf.Annotations.annotations_list.push([anno_text, anno_onset, duration, ID]);

        };
        if (edf.Annotations.annotaion_record_reading <= edf.records_count) {
            var progressVal = edf.Annotations.annotaion_record_reading / edf.records_count * 100;
            $('#loadingProgressBar').css('width', progressVal + '%');
            ReadSegmentAnnotatons();
        } else {
            $("#loadAnnotationModule").modal("hide");
            AnalysisAnnotatons();
        }
    }
}

function AnalysisAnnotatons() {
    sortAnnotaionTable(1, 'asc');
    plot_table_width_rearrange();
    $("body").css("cursor", "default");
    Assess_montage();

}

function sortAnnotaionTable(x, dir) {
    try {
        var row_info;

        function Comparator(a, b) {
            if (dir == 'asc') {
                if (a[x] < b[x]) return -1;
                if (a[x] > b[x]) return 1;
                return 0;
            } else {
                if (a[x] > b[x]) return -1;
                if (a[x] < b[x]) return 1;
                return 0;
            }
        }
        edf.Annotations.annotations_list = edf.Annotations.annotations_list.sort(Comparator);
        $('.annotation_row').remove();
        const montage_EEG_list = $("#montage_EEG_list").data('montage');
        const montage_EKG_list = $("#montage_EKG_list").data('montage');
        const montage_other_list = $("#montage_other_list").data('montage');
        const EEGlength = montage_EEG_list.length + montage_EKG_list.length + montage_other_list.length;

        for (i in edf.Annotations.annotations_list) {
            row_info = edf.Annotations.annotations_list[i]

            createAnnotaionRow(row_info[0], row_info[1], row_info[2]);
            if (EEGlength > 0 && edf.t_beg <= row_info[1] && row_info[1] < edf.t_beg + $('#windowduratin').data("window_duration")) {
                $('#' + row_info[3]).css('background-color', '#b7d4e2');
            }
        }
        if (edf.choosenAnnotation) {
            var ID = '#' + edf.choosenAnnotation[3];
            $(ID).css('background-color', '#c70ad1');
            $(ID).data('Chosen', 1);
        }
    } catch (err) {

    }
}

$('.annotaionHeader').on("click", function() {
    var dir;
    var x = $(this).data('col');
    if ($(this).data('sortOrder') == 'asc') {
        $(this).data('sortOrder', "desc");
        dir = 'asc';
    } else {
        $(this).data('sortOrder', "asc");
        dir = 'desc';
    }
    sortAnnotaionTable(x, dir);
});

function chCode(str) {
    return str.charCodeAt()
}

$(document).on('click', '.annotation_row', function() {
    var ID = generagteIDCode($(this).data('text'), $(this).data('onset'), $(this).data('duration'));
    if ($('#' + ID).data('Chosen') != 1) {
        $('.annotation_row').data('Chosen', '');
        $('#' + ID).data('Chosen', 1);
        $('.annotation_row').css('background-color', '#ffffff');
        $(this).css('background-color', '#c70ad1');
        const window_duration = parseInt($('#windowduratin').data("window_duration"));
        var t_mid = $(this).data('onset');
        var t_beg = t_mid - Math.floor(window_duration / 2);
        if (t_beg < 0) {
            t_beg = 0
        }
        edf.t_beg = parseInt(t_beg);
        edf.choosenAnnotation = [$(this).data('text'), $(this).data('onset'), $(this).data('duration'), ID];
        Jump();
    } else {
        $('#' + ID).css('background-color', '#ffffff');
        $('#' + ID).data('Chosen', '');
        edf.choosenAnnotation = '';
        readEEG();
    }

});

function SearchAnnotaion() {
    var input, filter, table, tr, td, i;
    input = document.getElementById("SearchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("AnnotaionTable");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td0 = tr[i].getElementsByTagName("td")[0];
        td1 = tr[i].getElementsByTagName("td")[1];
        if (td0.innerHTML.toUpperCase().indexOf(filter) > -1 || td1.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
        } else {
            tr[i].style.display = "none";
        }
    }
}

function generagteIDCode(anno_text, anno_onset, duration) {
    var x = anno_onset.toString() + duration.toString();
    var textCod = anno_text.split('').map(chCode).reduce((a, b) => a + b, 0);
    x = x + textCod;
    x = x.split('');
    x = x.map(chCode).join('');
    x = parseInt(x);
    return x.toString(16);
}

function createAnnotaionRow(anno_text, anno_onset, duration) {
    var annotaion_row, annotaion_text, annotation_time;
    var datetime = edf.date_time.clone();
    datetime = datetime.add(anno_onset, 'seconds');
    annotaion_row = $("<tr class='annotation_row' id='" + generagteIDCode(anno_text, anno_onset, duration) + "'></tr>");
    annotaion_text = $("<td >" + anno_text + "</td>");
    annotaion_text.css('width', 242);
    annotaion_row.append(annotaion_text);
    annotation_time = $("<td >" + datetime.format("HH:mm:ss") + "</td>");
    annotation_time.css('width', 90);
    annotaion_row.append(annotation_time);
    annotaion_row.data('onset', anno_onset);
    annotaion_row.data('duration', duration);
    annotaion_row.data('text', anno_text);
    $('#AnnotaionTable').append(annotaion_row);
}

document.getElementById('import_annotations_from_file').addEventListener('change', analysis_imported_annotaion_file, false);

function analysis_imported_annotaion_file(e) {
    if (!e.target.files[0]) {
        return;
    };
    annotaitonFile = {};
    annotaitonFile.fileName = e.target.files[0];
    var start = 8;
    var stop = 256;
    var file = annotaitonFile.fileName;
    var reader = new FileReader();
    var blob = file.slice(start, stop);
    $("body").css("cursor", "progress");
    reader.readAsBinaryString(blob);
    return reader.onloadend = function() {
        var data = reader.result;
        annotaitonFile.start_date = data.slice(160, 168).trim();
        annotaitonFile.start_time = data.slice(168, 176).trim();
        annotaitonFile.local_patient_id = data.slice(0, 80).trim();
        annotaitonFile.local_recording_id = data.slice(80, 160).trim();
        annotaitonFile.start_date = data.slice(160, 168).trim();
        annotaitonFile.start_time = data.slice(168, 176).trim();
        annotaitonFile.header_bytes_count = parseFloat(data.slice(176, 184).trim());
        annotaitonFile.reserved = data.slice(184, 228).trim();
        annotaitonFile.records_count = parseFloat(data.slice(228, 236).trim());
        annotaitonFile.record_duration = parseFloat(data.slice(236, 244).trim());
        if (annotaitonFile.start_date != edf.start_date) {
            $("body").css("cursor", "default");
            alert("Annotaions File'date doesn't match signal file'data");
            return;
        } else if (annotaitonFile.start_time != edf.start_time) {
            $("body").css("cursor", "default");
            alert("Annotaions File' start time doesn't match signal file start time");
            return;
        };
        start = 250;
        stop = annotaitonFile.header_bytes_count + 1;
        reader = new FileReader();
        blob = file.slice(start, stop);
        reader.readAsBinaryString(blob);
        return reader.onloadend = function() {
            data = reader.result.trim();
            var annotations_ch_exist = 0;
            var pointer = 4;
            var channels_count = parseFloat(data.slice(0, pointer).trim());
            var Annotaion_cH_index = 0;
            var ch;
            for (i = 0; i < channels_count; i++) {
                ch = data.slice(pointer, pointer + 16).trim()
                if (ch == "EDF Annotations") {
                    annotations_ch_exist = 1;
                    annotaitonFile["Annotaion_cH_index"] = Annotaion_cH_index;
                    break;
                }
                pointer = pointer + 16;
                Annotaion_cH_index++;
            }
            if (annotations_ch_exist == 0) {
                $("body").css("cursor", "default");
                alert('No annotaions channel was found')
                return;
            }
            pointer = 4 + 216 * channels_count + Annotaion_cH_index * 8;
            annotaitonFile["Annotaion_ch_bytes_per_record"] = data.slice(pointer, pointer + 8).trim() * 2;
            pointer = 4 + 216 * channels_count;
            annotaitonFile["bytes_per_record"] = 0;
            annotaitonFile["Annotaion_ch_bytes_offset"] = 0;
            for (i = 0; i < channels_count; i++) {
                ch = data.slice(pointer, pointer + 8).trim()
                annotaitonFile["bytes_per_record"] = annotaitonFile["bytes_per_record"] + ch * 2;
                if (i < annotaitonFile["Annotaion_cH_index"]) {
                    annotaitonFile["Annotaion_ch_bytes_offset"] = annotaitonFile["Annotaion_ch_bytes_offset"] + ch * 2;

                }
                pointer = pointer + 8;
            }
            annotaitonFile.annotaion_record_reading = 0;
            annotaitonFile.annotations_list = [];
            annotaitonFile.channel_block_start = annotaitonFile.header_bytes_count - 1 + annotaitonFile.Annotaion_ch_bytes_offset + annotaitonFile.annotaion_record_reading * annotaitonFile.bytes_per_record;
            $("#loadAnnotationModule").modal("show");
            Annotaiton_File_Read_Segment_Annotatons();
        }

    }

    function Annotaiton_File_Read_Segment_Annotatons() {
        var buf, anno_box, anno_box_ind, array8, anno, anno_start, duration_start, anno_onset, duration, anno_text, annotaion_row, annotaion_text, annotation_time, ID;
        var end = annotaitonFile.channel_block_start + annotaitonFile.Annotaion_ch_bytes_per_record;
        var block = [];
        var blob = annotaitonFile.fileName.slice(annotaitonFile.channel_block_start, end);
        var reader = new FileReader();
        reader.readAsArrayBuffer(blob);
        reader.onloadend = function() {
            annotaitonFile.annotaion_record_reading = annotaitonFile.annotaion_record_reading + 1;
            annotaitonFile.channel_block_start = annotaitonFile.header_bytes_count - 1 + annotaitonFile.Annotaion_ch_bytes_offset + annotaitonFile.annotaion_record_reading * annotaitonFile.bytes_per_record;
            buf = reader.result;
            array8 = new Uint8Array(buf);
            for (_ in array8) {
                block.push(parseFloat(array8[_]))
            }
            anno_box = [];
            for (var _ = 0; _ < block.length - 1; _++) {
                if (block[_] == 20 && block[_ + 1] == 0) {
                    anno_box.push(_);
                };
            };
            anno_box_ind = [];
            for (var _ = 0; _ < anno_box.length - 1; _++) {
                anno_box_ind.push([anno_box[_], anno_box[_ + 1]])
            };
            for (_ in anno_box_ind) {
                anno = block.slice(anno_box_ind[_][0] + 2, anno_box_ind[_][1]);
                anno_start = anno.indexOf(20);
                if (anno.includes(21)) {
                    duration_start = anno.indexOf(21);
                    anno_onset = String.fromCharCode.apply(null, anno.slice(1, duration_start));
                    anno_onset = parseFloat(anno_onset);
                    duration = String.fromCharCode.apply(null, anno.slice(duration_start + 1, anno_start));
                    duration = parseFloat(duration);
                } else {
                    anno_onset = String.fromCharCode.apply(null, anno.slice(1, anno_start));
                    anno_onset = parseFloat(anno_onset);
                    duration = 0;
                }

                anno_text = String.fromCharCode.apply(null, anno.slice(anno_start + 1, ));
                ID = generagteIDCode(anno_text, anno_onset, duration);
                if (edf.file_duration < anno_onset) {
                    $("body").css("cursor", "default");
                    alert('Annotaions dont match the length of the signal file');
                    return;
                }
                annotaitonFile.annotations_list.push([anno_text, anno_onset, duration, ID]);

            };
            if (annotaitonFile.annotaion_record_reading <= annotaitonFile.records_count) {
                var progressVal = (annotaitonFile.annotaion_record_reading / annotaitonFile.records_count) * 100;
                $('#loadingProgressBar').css('width', progressVal + '%');
                Annotaiton_File_Read_Segment_Annotatons();
            } else {
                $("#loadAnnotationModule").modal("hide");
                edf['Annotations'] = {};
                edf['Annotations'].read_annotaion = 1;
                edf['Annotations']['annotations_list'] = annotaitonFile.annotations_list;
                AnalysisAnnotatons();
            }
        }
    }

}

function plot_table_width_rearrange() {
    var channel_name_width = settings['channelWidth'];
    var show_annotaion = settings['AlwaysShowAnnotaionsTable'];
    var annotation_width = 363 * show_annotaion;
    $('.FirstCol').css('width', channel_name_width);
    $('.SecondCol').css('left', channel_name_width);
    var plotWidth = $('body').width() - annotation_width - channel_name_width;
    if (show_annotaion == 1) {
        $('.SecondCol').css('width', plotWidth);
        $('.ThirdCol').css('left', plotWidth + channel_name_width);
        $('.ThirdCol').css('visibility', 'visible');
        $('#annotaion_box').css('height', $(window).height() - 113);
        $('#annotaionsTableScrol').css('height', $('#annotaion_box').height() - 150);
    } else {
        plotWidth = plotWidth + annotation_width;
        $('#annotaion_box').css('height', $('body').height() - 113);
        $('#annotaionsTableScrol').css('height', $('#annotaion_box').height() - 150);
        $('.ThirdCol').css('visibility', 'hidden');
        $('.SecondCol').css('width', plotWidth);
    }

    scroll_marker_width_manager();
}

function Assess_montage(data) {

    var SavedEDFViewer;
    try {
        SavedEDFViewer = JSON.parse(localStorage.getItem("EDFViewer"));
    } catch (err) {}
    if (SavedEDFViewer) {
        if (SavedEDFViewer['montage']) {
            montage = SavedEDFViewer['montage'];
            readEEG();
            return;
        }

    }

    if (edf.keepmontage == 0) {

        const choosenMontage = montage[$('#montage').data('montageCode')];
        const montage_EEG_list = choosenMontage['EEG']
        const montage_EKG_list = choosenMontage['EKG']
        const montage_other_list = choosenMontage['Other']

        const EEGlength = montage_EEG_list.length + montage_EKG_list.length + montage_other_list.length;
        if (EEGlength == 0) {

            $('#montageModal').modal('show');
        } else {
            readEEG();
        }

    } else {
        readEEG();
    };

    return;

}

function loadoMntages() {
    var SavedEDFViewer;
    try {
        SavedEDFViewer = JSON.parse(localStorage.getItem("EDFViewer"));
    } catch (err) {}
    if (SavedEDFViewer) {
        if (SavedEDFViewer['montage']) {
            montage = SavedEDFViewer['montage'];
            refresh_montage_module();
        }

    }

}

function saveMontages() {
    var SavedEDFViewer;
    try {
        SavedEDFViewer = JSON.parse(localStorage.getItem("EDFViewer"));
    } catch (err) {}

    if (SavedEDFViewer) {
        SavedEDFViewer['montage'] = montage;
    } else {
        SavedEDFViewer = {
            'montage': montage,
        }
    }
    localStorage.setItem("EDFViewer", JSON.stringify(SavedEDFViewer));
    alert('Montages are saved');
}

function loadoSettings() {
    var SavedEDFViewer;
    try {
        SavedEDFViewer = JSON.parse(localStorage.getItem("EDFViewer"));
    } catch (err) {}
    if (SavedEDFViewer) {
        if (SavedEDFViewer['settings']) {
            settings = SavedEDFViewer['settings'];
        }

    }

}

function saveSettings() {
    var SavedEDFViewer;
    try {
        SavedEDFViewer = JSON.parse(localStorage.getItem("EDFViewer"));
    } catch (err) {}

    if (SavedEDFViewer) {
        SavedEDFViewer['settings'] = settings;
    } else {
        SavedEDFViewer = {
            'settings': settings,
        }
    }
    localStorage.setItem("EDFViewer", JSON.stringify(SavedEDFViewer));
    alert('Settings are saved');
    $('#SettingsModal').modal('hide');
}

$('#settings_btn').on("click", function() {
    var pos = (settings['channelWidth'] - 150) / 50;
    var showAllalways = settings['AlwaysShowAnnotaionsTable'];
    var onlyEDFplus = settings['EDFplusAnnotaionsTable'];
    $('#setting_CNW_slider').data('position', pos);
    $('#setting_CNW_slider').css('left', 30 * pos);
    if (showAllalways == 0 && onlyEDFplus == 0) {
        $('.SATob1').attr('checked', true);
        // }else if(showAllalways == 1 && onlyEDFplus == 1){
    } else {
        $('.SATob3').attr('checked', true);
    }

    $('#SettingsModal').modal('show');
});

$('#setting_CNW_decrease').on("click", function() {
    var pos = $('#setting_CNW_slider').data('position');
    if (pos > 0) {
        pos -= 1;
        change_channel_name_width(pos);
    }
});
$('#setting_CNW_increase').on("click", function() {
    var pos = $('#setting_CNW_slider').data('position');
    if (pos < 4) {
        pos += 1;
        change_channel_name_width(pos);
    }

});

$('.SATob1').on("click", function() {
    settings['AlwaysShowAnnotaionsTable'] = 0;
    settings['EDFplusAnnotaionsTable'] = 0;
    sizeChanged();
});

$('.SATob3').on("click", function() {
    settings['AlwaysShowAnnotaionsTable'] = 1;
    settings['EDFplusAnnotaionsTable'] = 1;
    sizeChanged();

});

function DeleteAllMontages() {
    if (confirm("Are you sure?") == true) {

        localStorage.removeItem('EDFViewer');
    }
}

function Reseteverything() {
    if (confirm("Are you sure?") == true) {
        var pos = 0;
        $('#setting_CNW_slider').data('position', pos);
        $('#setting_CNW_slider').css('left', 30 * pos);
        $('.SATob3').attr('checked', true);
        settings = {
            'channelWidth': 150,
            'AlwaysShowAnnotaionsTable': 1,
            'EDFplusAnnotaionsTable': 1,
        };
        localStorage.removeItem('EDFViewer');
        montage = {
            'm1': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
            'm2': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
            'm3': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
            'm4': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
            'm5': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
            'm6': {
                'EEG': [],
                'EKG': [],
                'Other': [],
            },
        };
        sizeChanged();
    }
}

function change_channel_name_width(pos) {
    $('#setting_CNW_slider').data('position', pos);
    $('#setting_CNW_slider').css('left', 30 * pos);
    settings['channelWidth'] = 150 + 50 * pos;
    sizeChanged();
}

document.getElementById('file-input').addEventListener('change', analysis_header, false);

$('#montage').click(function() {
    if (edf.fileName) {
        edf.montageEdit = 1;
        $(".montageEditBtn").css('visibility', 'hidden');
        create_rows_in_montage_modal_from_selected_montage();

        $('#montageModal').modal('show');
    }
});

function create_rows_in_montage_modal_from_selected_montage() {

    var ch, ch1, ch2, i;
    var choosenMontage = montage[$('#montage').data('montageCode')];

    if (choosenMontage['EEG']) {
        for (i in choosenMontage['EEG']) {
            ch2 = '';
            ch = choosenMontage['EEG'][i];
            ch1 = ch[0];
            if (ch.length > 1) {
                ch2 = ch[1];
            }
            create_EEG_montage_modal_row(ch[0], ch[1], 0);
        }
    }

    if (choosenMontage['EKG']) {
        for (i in choosenMontage['EKG']) {
            ch2 = '';
            ch = choosenMontage['EKG'][i];
            ch1 = ch[0];
            if (ch.length > 1) {
                ch2 = ch[1];
            }
            create_EKG_montage_modal_row(ch[0], ch[1]);
        }
    }
    if (choosenMontage['Other']) {
        for (i in choosenMontage['Other']) {
            ch = choosenMontage['Other'][i];
            create_Other_montage_modal_row(ch[0]);
        }
    }
}

$(document).on('click', '.montageChannel_1', function() {
    var ch = $(this).data('ch');
    $("#EEGMontage").data('ch1', ch);
    $("#EKGMontage").data('ch1', ch);
    $("#OtherMontage").data('ch1', ch);
});
$(document).on('click', '.montageChannel_2', function() {
    var ch = $(this).data('ch');
    $("#EEGMontage").data('ch2', ch);
    $("#EKGMontage").data('ch2', ch);
    $("#OtherMontage").data('ch2', ch);
});
$(document).on('click', '.montageall', function() {

    var id = $(this).data("RawId");
    var ch = $(this).data('ch');
    var group = $(this).data('montage');
    $(".montageEditBtn").data('ch', ch);
    $(".montageEditBtn").data('group', group);
    $(".montageEditBtn").data('id', id);
    $('.montageMoveBtn').removeClass('btn-info  btn-success btn-warning');
    if (group == 'EEG') {
        $('.montageMoveBtn').addClass('btn-info');
        $('.montageMoveBtn').data('IDcode', '_EEG');
    } else if (group == 'EKG') {
        $('.montageMoveBtn').addClass('btn-success');
        $('.montageMoveBtn').data('IDcode', '_EKG');
    } else {
        $('.montageMoveBtn').addClass('btn-warning');
        $('.montageMoveBtn').data('IDcode', '_OTH');
    }
    $(".montageEditBtn").css('visibility', 'visible');

});
$("#EEGMontage").on("click", function() {
    var cho1 = $(this).data('ch1');
    var cho2 = $(this).data('ch2');

    create_EEG_montage_modal_row(cho1, cho2, 1);

});
$("#EKGMontage").on("click", function() {
    var cho1 = $(this).data('ch1');
    var cho2 = $(this).data('ch2');
    create_EKG_montage_modal_row(cho1, cho2, 1);
});

$("#OtherMontage").on("click", function() {
    $("#montage").data('plotMontage', 1);
    var cho1 = $(this).data('ch1');
    create_Other_montage_modal_row(cho1, 1);
});

function create_modal_montage_id_code(ch, IDcode) {
    IDcode = IDcode.slice(1);
    var x = IDcode.split('').map(chCode).reduce((a, b) => a + b, 0);
    x = parseInt(x).toString(16).toUpperCase();
    var c;
    for (i in ch) {
        c = ch[i].split('').map(chCode).join('');
        c = parseInt(c).toString(16).toUpperCase();
        x += c;
    }
    return x;

}

function create_EEG_montage_modal_row(cho1, cho2, update_montage) {
    var ch, lbl;
    var ref = 0;
    var ch_in_montage = 1;

    if (!edf.channel_labels.includes(cho1)) {
        ch_in_montage = 0;
    }
    if (cho2 && !edf.channel_labels.includes(cho2)) {
        ch_in_montage = 0;
    };

    var choosenMontage = montage[$('#montage').data('montageCode')];
    var montagedata = choosenMontage['EEG'];

    if (cho1 != null) {
        if (ch_in_montage == 1) {
            if (update_montage == 1) {
                ref = $('#refrential').data('refrentialCh');
            };
            if (ref == 0 && cho2 != null) {
                if (ch_dic[cho1].channel_sample_rates != ch_dic[cho2].channel_sample_rates) {
                    alert(cho1 + ', ' + cho2 + " don't have the same sampling rate!");
                    return;
                }
                lbl = cho1 + '-' + cho2;
                ch = [cho1, cho2];
            } else {
                lbl = cho1;
                ch = [cho1];
            }

            var douplication = 0;

            if (update_montage == 1) {
                $("#montage").data('plotMontage', 1);

                for (i in montagedata) {
                    if (ch.toString() == montagedata[i].toString()) {
                        douplication = 1;
                    }
                }
            }
        } else {
            if (cho2 != null) {
                ch = [cho1, cho2];
                lbl = ch.join("-");
            } else {
                lbl = cho1;
                ch = [cho1];
            }
        }

        if (douplication == 1) {
            alert(lbl + ' is already exist in the montage')
        } else {

            var id = create_modal_montage_id_code(ch, '_EEG');

            li = $('<li style="padding: 0px; margin:0px;" class="montageWindowName"></li>');
            li.css('margin-top', 5);
            li.css('margin-bottom', 5);

            var Chlbl = $('<label  class="btn btn-info montageall"><input type="radio" name="montageall"  autocomplete="off">' + lbl + '</label>')
            Chlbl.attr('id', id);
            Chlbl.data('ch', ch);
            Chlbl.data('montage', 'EEG');

            Chlbl.css('width', 225);
            Chlbl.css('padding-left', 0);
            Chlbl.css('text-align', 'left');
            Chlbl.data('RawId', id);
            if (lbl > 27) {
                Chlbl.css('font-size', 11);
            } else {
                Chlbl.css('font-size', 13);
            };
            if (ch_in_montage == 0) {
                Chlbl.addClass('EEGDeactivate');
                Chlbl.css("color", '#222222');
            }

            li.append(Chlbl);

            $('#montage_EEG_list').append(li);

            if (update_montage == 1) {
                montagedata.push(ch);
                choosenMontage['EEG'] = montagedata;
            }
        };
    }

}

function create_EKG_montage_modal_row(cho1, cho2, update_montage = 0) {
    var ch, lbl;
    var ref = 0;
    var ch_in_montage = 1;
    if (!edf.channel_labels.includes(cho1)) {
        ch_in_montage = 0;
    }
    if (cho2 && !edf.channel_labels.includes(cho2)) {
        ch_in_montage = 0;
    };
    var choosenMontage = montage[$('#montage').data('montageCode')];
    var montagedata = choosenMontage['EKG'];

    if (cho1 != null) {
        if (ch_in_montage == 1) {

            if (update_montage == 1) {
                ref = $('#refrential').data('refrentialCh');
            };

            if (ref == 0 && cho2 != null) {
                if (ch_dic[cho1].channel_sample_rates != ch_dic[cho2].channel_sample_rates) {
                    alert(cho1 + ', ' + cho2 + " don't have the same sampling rate!");
                    return;
                }
                lbl = cho1 + '-' + cho2;
                ch = [cho1, cho2];
            } else {
                lbl = cho1;
                ch = [cho1];
            }

            $("#montage").data('plotMontage', 1);
            var douplication = 0;
            if (update_montage == 1) {
                for (i in montagedata) {

                    if (ch.toString() == montagedata[i].toString()) {
                        douplication = 1;
                    }
                }
            }

        } else {
            if (cho2 != null) {
                ch = [cho1, cho2];
                lbl = ch.join("-");
            } else {
                lbl = cho1;
                ch = [cho1];
            }
        }

        if (douplication == 1) {
            alert(lbl + ' is already exist in the montage')
        } else {

            var id = create_modal_montage_id_code(ch, '_EKG');
            li = $('<li style="padding: 0px; margin:0px;" class="montageWindowName" ></li>');
            li.css('margin-top', 5);
            li.css('margin-bottom', 5);

            var Chlbl = $('<label id = ' + id + ' class="btn btn-success montageall"><input type="radio" name="montageall"  autocomplete="off">' + lbl + '</label>')
            Chlbl.attr('id', id);
            Chlbl.data('ch', ch);
            Chlbl.data('montage', 'EKG');
            Chlbl.css('width', 225);

            Chlbl.css('padding-left', 0);
            Chlbl.css('text-align', 'left');

            Chlbl.data('RawId', id);
            if (lbl > 27) {
                Chlbl.css('font-size', 9);
            } else if (lbl > 23) {
                Chlbl.css('font-size', 11);
            } else {
                Chlbl.css('font-size', 13);
            };
            if (ch_in_montage == 0) {
                Chlbl.addClass('EKGDeactivate');
                Chlbl.css("color", '#222222');
            }
            li.append(Chlbl);

            $('#montage_EKG_list').append(li);

            if (update_montage == 1) {
                montagedata.push(ch);
                choosenMontage['EKG'] = montagedata;
            }
        };
    }

}

function create_Other_montage_modal_row(cho1, update_montage = 0) {
    var lbl = cho1;
    var ch = [cho1];
    var ch_in_montage = 1;
    if (!edf.channel_labels.includes(cho1)) {
        ch_in_montage = 0;
    }
    var choosenMontage = montage[$('#montage').data('montageCode')];
    const montagedata = choosenMontage['Other'];

    if (cho1 != null) {
        if (ch_in_montage == 1) {
            var douplication = 0;

            if (update_montage == 1) {
                for (i in montagedata) {

                    if (ch.toString() == montagedata[i].toString()) {
                        douplication = 1;
                    }
                }
            }
        }
        if (douplication == 1) {
            alert(lbl + ' is already exist in the montage')
        } else {

            var id = create_modal_montage_id_code(ch, '_OTH');
            li = $('<li style="padding: 0px; margin:0px;" class="montageWindowName" ></li>');
            li.css('margin-top', 5);
            li.css('margin-bottom', 5);

            var Chlbl = $('<label class="btn btn-warning montageall" ><input type="radio" name="montageall"  autocomplete="off">' + lbl + '</label>')
            Chlbl.attr('id', id);
            Chlbl.data('ch', ch);
            Chlbl.data('montage', 'Other');
            Chlbl.css('width', 225);
            Chlbl.css('padding-left', 0);
            Chlbl.css('text-align', 'left');

            Chlbl.data('RawId', id);
            if (lbl > 27) {
                Chlbl.css('font-size', 11);
            } else {
                Chlbl.css('font-size', 13);
            };
            if (ch_in_montage == 0) {
                Chlbl.addClass('OthersDeactivate');
                Chlbl.css("color", '#222222');
            }

            li.append(Chlbl);

            $('#montage_other_list').append(li);

            if (update_montage == 1) {
                montagedata.push(ch);
                choosenMontage['Other'] = montagedata;
            }

        };
    }
}

function refresh_montage_module() {
    $('.montageall').remove();
    create_rows_in_montage_modal_from_selected_montage();
}

$("#delelteMontage").on("click", function() {
    $("#montage").data('plotMontage', 1);
    var cho = $(this).data('ch');
    var group = $(this).data('group');
    var id = $(this).data('id');
    var choosenMontage = montage[$('#montage').data('montageCode')];
    var grouparray = choosenMontage[group];

    if (cho != null) {
        var indexTodelete = 0;
        $('#' + id).remove();
        for (i in grouparray) {
            if (grouparray[i].join("") == cho.join("")) {
                grouparray.splice(indexTodelete, 1);
            }
            indexTodelete++;
        }
        choosenMontage[group] = grouparray;
    }
    $(".montageEditBtn").css('visibility', 'hidden');
    refresh_montage_module();
});

$('#UpMontage').on("click", function() {
    $("#montage").data('plotMontage', 1);
    var ch = $(this).data('ch');
    var group = $(this).data('group');
    var id = $(this).data('id');
    var choosenMontage = montage[$('#montage').data('montageCode')];

    var currentIndex = -1;
    for (var i = 0; i < choosenMontage[group].length; i++) {
        if (choosenMontage[group][i].join("") == ch.join("")) {
            currentIndex = i;
            break;
        }
    }
    if (currentIndex > 0) {
        var previous_id = create_modal_montage_id_code(choosenMontage[group][currentIndex - 1], $(this).data('IDcode'));
        $("#" + id).closest('li').insertBefore($("#" + previous_id).closest('li'));
        choosenMontage[group].splice(currentIndex, 1);
        choosenMontage[group].splice(currentIndex - 1, 0, ch);

    }
});

$('#DownMontage').on("click", function() {

    $("#montage").data('plotMontage', 1);
    var ch = $(this).data('ch');
    var group = $(this).data('group');
    var id = $(this).data('id');
    var choosenMontage = montage[$('#montage').data('montageCode')];

    var currentIndex = -1;
    for (var i = 0; i < choosenMontage[group].length - 1; i++) {
        if (choosenMontage[group][i].toString() == ch.toString()) {
            currentIndex = i;
            break;
        }
    }
    if (currentIndex != -1) {
        var next_id = create_modal_montage_id_code(choosenMontage[group][currentIndex + 1], $(this).data('IDcode'));
        $("#" + id).closest('li').insertAfter($("#" + next_id).closest('li'));
        choosenMontage[group].splice(currentIndex, 1);
        choosenMontage[group].splice(currentIndex + 1, 0, ch);

    }
});

$('.montageSelect').on("click", function() {
    $('#general_montage_num').text($(this).data('montageNum'));
    $('#montage_modal_txt').text(' Montage ' + $(this).data('montageNum'));
    $('#montage').data('montageCode', 'm' + $(this).data('montageNum'));
    if (edf.fileName) {
        $("#montage").data('plotMontage', 1);
        readEEG();
    };
});

$('.montage_modal_list').on("click", function() {
    $("#montage").data('plotMontage', 1);
    $('#general_montage_num').text($(this).data('montageNum'));
    $('#montage_modal_txt').text(' Montage ' + $(this).data('montageNum'));
    $('#montage').data('montageCode', 'm' + $(this).data('montageNum'));
    $('.Montage' + $(this).data('montageNum')).prop("checked", true);
    refresh_montage_module();
});

$('#montageModal').on('hidden.bs.modal', function() {
    $('.montageall').remove();
    $(".montageEditBtn").css('visibility', 'hidden');
    edf.montageEdit = 0;
    if (edf.fileName) {
        readEEG();
    };
});

function CreateTrace(col) {
    var trace = {
        x: [],
        y: [],

        marker: {
            color: col
        },
        type: 'scatter'
    };
    return trace
}

function scale(int16_data) {
    var p_min = ch_dic[edf.ch].channel_phys_minimums;
    var d_min = ch_dic[edf.ch].channel_dig_minimums;
    var scale = ch_dic[edf.ch].channel_scaling_factors;
    return (scale * (int16_data - d_min) + p_min);
}

function readEEG() {
    $('.showAtbegining').css('visibility', 'visible');
    $('#scroll_marker').css('left', (parseInt((parseInt($('#scroll_body').width()) * edf.t_beg) / edf.file_duration)));

    const choosenMontage = montage[$('#montage').data('montageCode')];
    const montage_EEG_list = choosenMontage['EEG']
    const montage_EKG_list = choosenMontage['EKG']
    const montage_other_list = choosenMontage['Other']

    const EEGlength = montage_EEG_list.length + montage_EKG_list.length + montage_other_list.length;
    if (EEGlength == 0) {
        $("#EEGDiv").remove();
        $("#EKGDiv").remove();
        $("#otherDiv").remove();
        $('.ChDiv').remove();
        $("#UpperTimeMarkDiv").remove();
        $("#LowerTimeMarkDiv").remove();
        $('#EEGchName').css('height', 0);
        $('#EKGchName').css('height', 0);
        $('#otherchName').css('height', 0);
        $('#UpperTimeMarkName').css('height', 0);
        $('#LowerTimeMarkName').css('height', 0);
        $('.RowTwoPlot').css('visibility', 'hidden');
        $('.FirstCol').css('borderRightWidth', 0);
        $('.SecondCol').css('borderRightWidth', 0);
        $("#montage").data('plotMontage', 1);
        return
    };

    const timeScaleHieght = 15;
    var annotaionTextHieght = 0;
    if (edf['Annotations'].read_annotaion == 1 || settings['AlwaysShowAnnotaionsTable'] == 1) {
        annotaionTextHieght = 40;
    }
    const EEGchDivHieght = ($(window).height() - 115 - annotaionTextHieght - timeScaleHieght * 2) / EEGlength; //113
    const EEGdivHieght = EEGchDivHieght * montage_EEG_list.length;
    var ampfactor = $('#amp').data("amplitudeCalibration");
    var EEGplotamp = EEGdivHieght * ampfactor * 0.26;
    var EKGdivHieght = EEGchDivHieght * montage_EKG_list.length;
    const otherdivHieght = EEGchDivHieght * montage_other_list.length;
    var ch_in_montage;
    var chosenAnnoID = '';
    var plotAnnotaions = edf['Annotations'].read_annotaion;
    if (plotAnnotaions == 1) {

        $('.annotation_row').css('background-color', '#ffffff');
        if (edf.choosenAnnotation) {
            chosenAnnoID = edf.choosenAnnotation[3];
            $('#' + chosenAnnoID).css('background-color', '#c70ad1');
        }
        var annotaionsInWindow = edf.Annotations.annotations_list.map(function(annotaion_row) {
            if (edf.t_beg <= annotaion_row[1] && annotaion_row[1] < edf.t_beg + $('#windowduratin').data("window_duration")) {
                return annotaion_row;
            } else {
                return ''
            }
        });
        annotaionsInWindow = annotaionsInWindow.filter(function(n) {
            return n != ''
        });

    }
    var jump_point;
    if (edf.jump_point) {
        jump_point = edf.jump_point;
        delete edf.jump_point;
    }
    var window_duration = $('#windowduratin').data("window_duration");
    var t_beg = edf.t_beg;
    var t_end = t_beg + $('#windowduratin').data("window_duration");
    if (t_beg >= 2) {
        t_beg = t_beg - 2;
        edf.initial_condition_start = -2;
    } else {
        edf.initial_condition_start = 0;
    };
    if (t_end <= edf.file_duration - 3) {
        t_end = t_end + 2;
        edf.initial_condition_end = -2;
    } else {
        edf.initial_condition_end = 0;
    }
    window_duration = window_duration + (-1 * (edf.initial_condition_start + edf.initial_condition_end));
    const hp = 30;
    var EEG_plotdic = {};
    for (i in montage_EEG_list) {
        EEG_plotdic[montage_EEG_list[i]] = new CreateTrace("#000000");
    }
    var plotEEGdata = [];
    var records_in_window = Math.ceil(window_duration / edf.record_duration) + 1;
    var st;
    var end;
    var rec_st;
    var rec_end;
    var c;
    var rec_num;
    for (i in edf.channel_labels) {
        ch_dic[edf.channel_labels[i]].bytes_table = [];
        st = edf.channel_record_onset[i];
        end = edf.channel_record_end[i];
        rec_num = 0;
        while (rec_num < records_in_window) {
            rec_st = edf.samples_per_record * rec_num + st;
            rec_end = edf.samples_per_record * rec_num + end;
            ch_dic[edf.channel_labels[i]].bytes_table.push([rec_st, rec_end]);
            rec_num++;
        }
    }

    function readCh(ch, data) {
        var channel = [];
        var _;
        if (ch.length == 1) {
            for (i in ch_dic[ch].bytes_table) {
                _ = data.slice(ch_dic[ch].bytes_table[i][0], ch_dic[ch].bytes_table[i][1]);
                for (x in _) {

                    channel.push(_[x]);
                }
            }
            edf.ch = ch;
            channel = channel.map(scale);

        } else {
            var ch1 = ch[0];
            var ch2 = ch[1];
            var channel_1 = [];
            var channel_2 = [];

            for (i in ch_dic[ch1].bytes_table) {
                _ = data.slice(ch_dic[ch1].bytes_table[i][0], ch_dic[ch1].bytes_table[i][1]);
                for (x in _) {
                    channel_1.push(_[x]);
                }
            }
            edf.ch = ch1;
            channel_1 = channel_1.map(scale);
            for (i in ch_dic[ch2].bytes_table) {
                _ = data.slice(ch_dic[ch2].bytes_table[i][0], ch_dic[ch2].bytes_table[i][1]);
                for (x in _) {
                    channel_2.push(_[x]);
                }
            }
            edf.ch = ch2;
            channel_2 = channel_2.map(scale);
            for (i in channel_1) {
                channel.push(channel_1[i] - channel_2[i]);
            }
        }
        var str_clip_ch = parseInt(parseFloat(beg_clip_sec) * ch_dic[edf.ch].channel_sample_rates);
        var end_clip_ch = parseInt(channel.length - parseFloat(end_clip_sec) * ch_dic[edf.ch].channel_sample_rates);
        channel = channel.slice(str_clip_ch, end_clip_ch);
        return channel
    }
    edf.plotting = 1;
    var recStart = t_beg / edf.record_duration;
    var recEnd = (window_duration / edf.record_duration) + recStart;
    var rec_beg_frac = recStart - Math.floor(recStart);
    var rec_end_frac = Math.ceil(recEnd) - recEnd;
    recStart = Math.floor(recStart);
    var beg_clip = Math.floor(rec_beg_frac * parseFloat(edf.channel_samples_per_record));
    var beg_clip_sec = (rec_beg_frac * edf.record_duration).toFixed(4);
    var end_clip_sec = (rec_end_frac * edf.record_duration).toFixed(4);
    recEnd = Math.ceil(recEnd);
    var end_clip = Math.floor((rec_end_frac) * parseFloat(edf.channel_samples_per_record));
    var start = edf.records_start[recStart];
    var end = edf.records_start[recEnd];
    var reader = new FileReader();
    var blob = edf.fileName.slice(start, end);
    reader.readAsArrayBuffer(blob);
    reader.onloadend = function() {
        var buf = reader.result;
        var data = new Int16Array(buf);
        var channel;
        var invert_factor = $('#invert').data('invertCh') * -1;

        $('.RowTwoPlot').css('visibility', 'visible');
        $('.FirstCol').css('borderRightWidth', 1);
        $('.SecondCol').css('borderRightWidth', 1);

        $('#UpperTimeMarkName').css('height', timeScaleHieght);
        $('#LowerTimeMarkName').css('height', timeScaleHieght);
        $('#AnnotaionName').css('height', annotaionTextHieght);

        $("#EEGDiv").remove();
        $("#EKGDiv").remove();
        $("#otherDiv").remove();
        $("#UpperTimeMarkDiv").remove();
        $("#LowerTimeMarkDiv").remove();
        $("#annotaionTextDiv").remove();

        if ($("#montage").data('plotMontage') == 1) {
            $('.ChDiv').remove();
            $('#EEGchName').css('height', EEGdivHieght);
            $('#EKGchName').css('height', EKGdivHieght);
            $('#otherchName').css('height', otherdivHieght);
        }
        var div;
        div = $("<div id ='EEGDiv'></div>");
        div.css("height", EEGdivHieght);
        $('#EEGplot').append(div);
        div = $("<div id ='EKGDiv'></div>");
        div.css("height", EKGdivHieght);
        $('#EKGplot').append(div);
        div = $("<div id ='otherDiv'></div>");
        div.css("height", otherdivHieght);
        $('#Otherplot').append(div);

        div = $("<div id ='UpperTimeMarkDiv'></div>");
        div.css("height", timeScaleHieght);
        $('#UpperTimeMarkplot').append(div);
        div = $("<div id ='LowerTimeMarkDiv'></div>");
        div.css("height", timeScaleHieght);
        $('#LowerTimeMarkplot').append(div);

        if (edf['Annotations'].read_annotaion == 1) {
            div = $("<div id ='annotaionTextDiv'></div>");
            div.css("height", annotaionTextHieght);
            $('#Annotaionplot').append(div);
        }

        var solidTimLines = {
            1: [0.2, 0.4, 0.6, 0.8],
            3: [0.5, 1, 1.5, 2, 2.5],
            7: [1, 2, 3, 4, 5, 6],
            10: [2, 4, 6, 8],
            15: [2, 4, 6, 8, 10, 12, 14],
            30: [5, 10, 15, 20, 25],
            60: [10, 20, 30, 40, 50]
        }

        var dotedTimLines = {
            1: [],
            3: [],
            7: [],
            10: [1, 3, 5, 7, 9],
            15: [1, 3, 5, 7, 9, 11, 13],
            30: [],
            60: [5, 15, 25, 35, 45, 55],
        }

        var solidTimeLineslist = solidTimLines[$('#windowduratin').data("window_duration")];
        var dotedTimLineslist = dotedTimLines[$('#windowduratin').data("window_duration")];

        var pos = EEGplotamp;
        var seg = EEGplotamp / (montage_EEG_list.length + 1);

        var Trace = new CreateTrace("#000000")
        plotdata = [Trace];
        var layout = {
            showlegend: false,
            annotations: [],
            shapes: [],
            xaxis: {
                range: [0, $('#windowduratin').data("window_duration")],
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
            },
            yaxis: {
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: "",
                showticklabels: false,
                range: [9.9, 12],
            },
            margin: {
                l: 0,
                r: 0,
                b: 1,
                t: 1,
                pad: 0
            },
        };

        if (plotAnnotaions == 1) {
            var annotaionsLocation = 10.1;
            var index;
            for (i in annotaionsInWindow) {
                if (annotaionsInWindow[i][3] != chosenAnnoID) {
                    $('#' + annotaionsInWindow[i][3]).css('background-color', '#b7d4e2');
                    layout.annotations.push({
                        x: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                        y: annotaionsLocation,
                        showarrow: false,
                        text: annotaionsInWindow[i][0],
                        font: {
                            size: 10,
                            color: '#1d40f2'
                        },
                    })

                } else {
                    index = i;

                }
                annotaionsLocation = annotaionsLocation + 0.55;
                if (annotaionsLocation > 11.2) {
                    annotaionsLocation = 10.1;
                }
            }

            if (index) {
                annotaionsInWindow.splice(index, 1);
            }

            if (edf.choosenAnnotation) {
                layout.annotations.push({
                    x: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start,
                    y: 11.6,
                    showarrow: false,
                    text: edf.choosenAnnotation[0],
                    font: {
                        size: 18,
                        color: '#c70ad1'
                    },
                });
            };

            Plotly.plot('annotaionTextDiv', plotdata, layout, {
                staticPlot: true
            });

        };

        if (settings['AlwaysShowAnnotaionsTable'] == 1 && plotAnnotaions != 1) {
            div = $("<div id ='annotaionTextDiv'></div>");
            div.css("height", annotaionTextHieght);
            $('#Annotaionplot').append(div);
            Plotly.plot('annotaionTextDiv', plotdata, layout, {
                staticPlot: true
            });
        };

        layout.shapes = [];
        layout.annotations = [];

        for (a in solidTimeLineslist) {
            layout.annotations.push({
                x: solidTimeLineslist[a],
                y: 11,
                showarrow: false,
                text: solidTimeLineslist[a],
            });
        };

        Plotly.plot('UpperTimeMarkDiv', plotdata, layout, {
            staticPlot: true,
        });
        layout.annotations = [];

        var datetime;
        var timeText;
        for (a in solidTimeLineslist) {
            datetime = edf.date_time.clone();
            datetime = datetime.add(edf.t_beg + solidTimeLineslist[a], 'seconds');
            if (Number.isInteger(solidTimeLineslist[a])) {
                timeText = datetime.format("HH:mm:ss");
            } else {
                timeText = datetime.format("HH:mm:ss.S");
            };

            layout.annotations.push({
                x: solidTimeLineslist[a],
                y: 11,
                showarrow: false,
                text: timeText, // solidTimeLineslist[a],
            });
        };
        Plotly.plot('LowerTimeMarkDiv', plotdata, layout, {
            staticPlot: true,
        });

        for (i in montage_EEG_list) {
            ch = montage_EEG_list[i];
            ch_in_montage = 1;
            for (c in ch) {
                if (!edf.channel_labels.includes(ch[c])) {
                    ch_in_montage = 0;
                }
            }

            pos = pos - seg;
            if (ch_in_montage == 1) {
                channel = readCh(ch, data);
                if ($('#DCbtn').data('DCremoval') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, 'HP');
                };
                if ($('#_60Hz').data('_60Hz') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, '_60Hz');
                };
                if ($('#_50Hz').data('_50Hz') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, '_50Hz');
                };

                for (var i = 0; i < channel.length; i++) {
                    EEG_plotdic[ch].x.push((i / ch_dic[edf.ch].channel_sample_rates) + edf.initial_condition_start);
                    EEG_plotdic[ch].y.push((channel[i] * invert_factor) + pos);
                }
                plotEEGdata.push(EEG_plotdic[ch]);
            }
        }

        layout = {
            showlegend: false,
            annotations: [],
            shapes: [],
            xaxis: {
                range: [0, $('#windowduratin').data("window_duration")],
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: '',
                showticklabels: false,
            },
            yaxis: {
                showgrid: false,
                zeroline: false,
                showline: false,
                autotick: true,
                ticks: "",
                showticklabels: false,
                range: [0, EEGplotamp],
            },
            margin: {
                l: 0,
                r: 0,
                b: 0,
                t: 1,
                pad: 0
            },
        };

        for (a in solidTimeLineslist) {

            layout.shapes.push({
                type: 'line',
                x0: solidTimeLineslist[a],
                y0: 0,
                x1: solidTimeLineslist[a],
                y1: EEGplotamp,
                line: {
                    color: '#666666',
                    width: 2,
                },
            });
        };

        for (a in dotedTimLineslist) {
            layout.shapes.push({
                type: 'line',
                x0: dotedTimLineslist[a],
                y0: 0,
                x1: dotedTimLineslist[a],
                y1: EEGplotamp,
                line: {
                    color: '#666666',
                    width: 2,
                    dash: 'dot',
                },
            });
        };

        if (jump_point) {
            layout.shapes.push({
                type: 'line',
                x0: jump_point - t_beg + edf.initial_condition_start,
                y0: 0,
                x1: jump_point - t_beg + edf.initial_condition_start,
                y1: EEGplotamp,
                opacity: 0.7,
                line: {
                    color: '#0275d8',
                    width: 5,
                },
            });
        }

        if (plotAnnotaions == 1) {
            for (i in annotaionsInWindow) {
                layout.shapes.push({
                    type: 'line',
                    x0: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                    y0: 0,
                    x1: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                    y1: EEGplotamp,
                    opacity: 0.5,
                    line: {
                        color: '#1d40f2',
                        width: 2,
                        dash: 'dot',
                    },
                });
            };

            if (edf.choosenAnnotation) {
                layout.shapes.push({
                    type: 'rect',
                    xref: 'x',
                    yref: 'y',
                    x0: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start,
                    y0: 0,
                    x1: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start + edf.choosenAnnotation[2],
                    y1: EEGplotamp,
                    line: {
                        color: '#7a015a',
                        width: 3,
                    },
                    fillcolor: '#f574fc',
                    opacity: 0.5,
                });

            };

        };
        var domin = 1;
        var chDiv;
        Plotly.plot('EEGDiv', plotEEGdata, layout, {
            staticPlot: true,
        });
        for (i in montage_EEG_list) {
            _ = parseInt(i) + 1;
            if ($("#montage").data('plotMontage') == 1) {
                chDiv = $("<div class='ChDiv'><span>" + montage_EEG_list[i].join("-") + "</span></div>");
                chDiv.css("height", EEGchDivHieght);
                if (EEGchDivHieght > 200) {
                    chDiv.css("padding-top", EEGchDivHieght / 2);
                } else {
                    chDiv.css("padding-top", EEGchDivHieght / 4);
                }
                chDiv.css("padding-left", 5);
                chDiv.css("background-color", '#5bc0de');
                chDiv.css("color", '#222222');
                chDiv.css("font-weight", 'bold');
                ch_in_montage = 1;
                for (c in montage_EEG_list[i]) {
                    if (!edf.channel_labels.includes(montage_EEG_list[i][c])) {
                        ch_in_montage = 0;
                    }
                }
                if (ch_in_montage == 0) {
                    chDiv.addClass('EEGDeactivate');
                } else {
                    chDiv.removeClass('EEGDeactivate');
                }

                $('#EEGchName').append(chDiv);
            };
            domin = domin - seg;
        };

        var y_max, y_min, y_padding, average;

        for (i in montage_EKG_list) {
            ch = montage_EKG_list[i];
            ch_in_montage = 1;
            for (c in ch) {
                if (!edf.channel_labels.includes(ch[c])) {
                    ch_in_montage = 0;
                }
            }
            if ($("#montage").data('plotMontage') == 1) {
                chDiv = $("<div class='ChDiv'><span >" + ch.join("-") + "</span></div>");
                chDiv.css("height", EEGchDivHieght);
                if (EEGchDivHieght > 200) {
                    chDiv.css("padding-top", EEGchDivHieght / 2);
                } else {
                    chDiv.css("padding-top", EEGchDivHieght / 4);
                }

                chDiv.css("padding-left", 5);
                chDiv.css("background-color", '#5cb85c');
                chDiv.css("color", '#222222');
                chDiv.css("font-weight", 'bold');
                if (ch_in_montage == 0) {
                    chDiv.addClass('EKGDeactivate');
                }

                $('#EKGchName').append(chDiv);
            };

            var Trace = new CreateTrace("#000000");
            if (ch_in_montage == 1) {
                channel = readCh(ch, data);
                if ($('#DCbtn').data('DCremoval') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, 'HP');
                };
                if ($('#_60Hz').data('_60Hz') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, '_60Hz');
                };
                if ($('#_50Hz').data('_50Hz') == 1) {
                    channel = filter(channel, ch_dic[ch[0]].channel_sample_rates, '_50Hz');
                };

                if (channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).length > 0) {
                    y_max = channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).reduce(function(a, b) {
                        return Math.max(a, b);
                    });
                    y_min = channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).reduce(function(a, b) {
                        return Math.min(a, b);
                    });
                    y_padding = 2 * Math.abs(y_max - y_min) / 100;
                } else {
                    y_max = 2;
                    y_min = 1;
                    y_padding = 0.1;
                }
                if (y_max == y_min) {
                    y_max = y_max * 2;
                    y_min = y_min - y_min;
                    y_padding = 0.1;
                }

                for (var i = 0; i < channel.length; i++) {
                    Trace.x.push((i / ch_dic[ch[0]].channel_sample_rates) + edf.initial_condition_start);
                    Trace.y.push(channel[i]);
                };
            } else {
                y_max = 2;
                y_min = 1;
                y_padding = 0.1;
            }
            plotdata = [Trace];
            layout = {
                showlegend: false,
                shapes: [],
                xaxis: {
                    range: [0, $('#windowduratin').data("window_duration")],
                    showgrid: false,
                    zeroline: false,
                    showline: false,
                    autotick: true,
                    ticks: '',
                    showticklabels: false,
                },
                yaxis: {
                    range: [y_min - y_padding, y_max + y_padding],
                    showgrid: false,
                    zeroline: false,
                    showline: false,
                    autotick: true,
                    ticks: "",
                    showticklabels: false,
                },
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 1,
                    pad: 0
                },
            };
            if (jump_point) {
                layout.shapes.push({
                    type: 'line',
                    x0: jump_point - t_beg + edf.initial_condition_start,
                    y0: y_min - y_padding * 2,
                    x1: jump_point - t_beg + edf.initial_condition_start,
                    y1: y_max + y_padding * 2,
                    opacity: 0.7,
                    line: {
                        color: '#0275d8',
                        width: 5,
                    },
                })
            }

            if (plotAnnotaions == 1) {
                for (i in annotaionsInWindow) {
                    layout.shapes.push({
                        type: 'line',
                        x0: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                        y0: y_min - y_padding * 2,
                        x1: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                        y1: y_max + y_padding * 2,
                        opacity: 0.5,
                        line: {
                            color: '#1d40f2',
                            width: 2,
                            dash: 'dot',

                        },
                    })
                }

                if (edf.choosenAnnotation) {
                    layout.shapes.push({
                        type: 'rect',
                        xref: 'x',
                        yref: 'y',
                        x0: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start,
                        y0: y_min - y_padding * 2,
                        x1: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start + edf.choosenAnnotation[2],
                        y1: y_max + y_padding * 2,
                        line: {
                            color: '#7a015a',
                            width: 3,
                        },
                        fillcolor: '#f574fc',
                        opacity: 0.5,
                    })
                }

            }
            for (a in solidTimeLineslist) {
                layout.shapes.push({
                    type: 'line',
                    x0: solidTimeLineslist[a],
                    y0: y_min - y_padding * 2,
                    x1: solidTimeLineslist[a],
                    y1: y_max + y_padding * 2,
                    line: {
                        color: '#666666',
                        width: 2,
                    },
                });
            };

            for (a in dotedTimLineslist) {
                layout.shapes.push({
                    type: 'line',
                    x0: dotedTimLineslist[a],
                    y0: y_min - y_padding * 2,
                    x1: dotedTimLineslist[a],
                    y1: y_max + y_padding * 2,
                    line: {
                        color: '#666666',
                        width: 2,
                        dash: 'dot',
                    },
                });
            };

            var opltDiv = $("<div class='otherplot' id='" + ch + "_EKGplot'></div>");
            opltDiv.css("height", EEGchDivHieght);
            opltDiv.css("padding", 0);
            opltDiv.css("margin", 0);
            $('#EKGDiv').append(opltDiv);
            Plotly.plot(ch + '_EKGplot', plotdata, layout, {
                staticPlot: true
            });

        };

        if (montage_other_list.length > 0) {
            var domin = 1;
            var chDiv;
            var seg = 1 / montage_other_list.length;
            for (i in montage_other_list) {

                ch = montage_other_list[i];
                ch_in_montage = 1;
                for (c in ch) {
                    if (!edf.channel_labels.includes(ch[c])) {
                        ch_in_montage = 0;
                    }
                }

                var Trace = new CreateTrace("#000000")
                var mn, mx;
                if (ch_in_montage == 1) {
                    channel = readCh(ch, data);

                    if (channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).length > 0) {
                        for (var _ = 0; _ < channel.length; _++) {
                            Trace.x.push((_ / ch_dic[ch[0]].channel_sample_rates) + edf.initial_condition_start);
                            Trace.y.push(channel[_]);
                        }
                        y_max = channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).reduce(function(a, b) {
                            return Math.max(a, b);

                        });
                        y_min = channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).reduce(function(a, b) {
                            return Math.min(a, b);
                        });
                        average = Math.round(channel.slice(ch_dic[ch[0]].channel_sample_rates, channel.length - ch_dic[ch[0]].channel_sample_rates).reduce(function(a, b) {
                            return a + b;
                        }) / channel.length * 100) / 100;
                        y_padding = 2 * Math.abs(y_max - y_min) / 100;
                        mx = Math.round(y_max * 100) / 100;
                        mn = Math.round(y_min * 100) / 100;
                    } else {

                        y_max = 2;
                        y_min = 1;
                        y_padding = 0.1;
                        average = '';
                        mx = '';
                        mn = '';
                    }

                    if (y_max == y_min) {
                        y_max = y_max * 2;
                        y_min = y_min - y_min;
                        y_padding = 0.1;

                    }
                } else {
                    y_max = 2;
                    y_min = 1;
                    y_padding = 0.1;
                    average = '';
                    mx = '';
                    mn = '';
                }
                var min_max;
                if (mn == mx) {
                    min_max = mn;
                } else {
                    min_max = mn + ' - ' + mx;
                }
                plotdata = [Trace];
                layout = {
                    showlegend: false,
                    shapes: [],
                    xaxis: {
                        range: [0, $('#windowduratin').data("window_duration")],
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        autotick: true,
                        ticks: '',
                        showticklabels: false,
                    },
                    yaxis: {
                        range: [y_min - y_padding, y_max + y_padding],
                        showgrid: false,
                        zeroline: false,
                        showline: false,
                        autotick: true,
                        ticks: "",
                        showticklabels: false,
                    },
                    margin: {
                        l: 0,
                        r: 0,
                        b: 0,
                        t: 1,
                        pad: 0,
                    },
                };

                if (jump_point) {
                    layout.shapes.push({
                        type: 'line',
                        x0: jump_point - t_beg + edf.initial_condition_start,
                        y0: y_min - y_padding * 2,
                        x1: jump_point - t_beg + edf.initial_condition_start,
                        y1: y_max + y_padding * 2,
                        opacity: 0.7,
                        line: {
                            color: '#0275d8',
                            width: 5,
                        },
                    });
                }

                if (plotAnnotaions == 1) {
                    for (i in annotaionsInWindow) {

                        layout.shapes.push({
                            type: 'line',
                            x0: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                            y0: y_min - y_padding * 2,
                            x1: annotaionsInWindow[i][1] - t_beg + edf.initial_condition_start,
                            y1: y_max + y_padding * 2,
                            opacity: 0.5,
                            line: {
                                color: '#1d40f2',
                                width: 2,
                                dash: 'dot',

                            },
                        });
                    };

                    if (edf.choosenAnnotation) {
                        layout.shapes.push({
                            type: 'rect',
                            xref: 'x',
                            yref: 'y',
                            x0: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start,
                            y0: y_min - y_padding * 2,
                            x1: edf.choosenAnnotation[1] - t_beg + edf.initial_condition_start + edf.choosenAnnotation[2],
                            y1: y_max + y_padding * 2,
                            line: {
                                color: '#7a015a',
                                width: 3,

                            },
                            fillcolor: '#f574fc',
                            opacity: 0.5,
                        });
                    };

                };
                for (a in solidTimeLineslist) {
                    layout.shapes.push({
                        type: 'line',
                        x0: solidTimeLineslist[a],
                        y0: y_min - y_padding * 2,
                        x1: solidTimeLineslist[a],
                        y1: y_max + y_padding * 2,
                        line: {
                            color: '#666666',
                            width: 2,
                        },
                    });
                };
                for (a in dotedTimLineslist) {
                    layout.shapes.push({
                        type: 'line',
                        x0: dotedTimLineslist[a],
                        y0: y_min - y_padding * 2,
                        x1: dotedTimLineslist[a],
                        y1: y_max + y_padding * 2,
                        line: {
                            color: '#666666',
                            width: 2,
                            dash: 'dot',
                        },
                    });
                };
                var opltDiv = $("<div class='otherplot' id='" + ch + "_Otherplot'></div>");
                opltDiv.css("height", EEGchDivHieght);
                opltDiv.css("padding", 0);
                opltDiv.css("margin", 0);
                $('#otherDiv').append(opltDiv);
                Plotly.plot(ch + '_Otherplot', plotdata, layout, {
                    displayModeBar: false
                });
                var id = create_modal_montage_id_code(ch, '_OTH_span_mm');
                if ($("#montage").data('plotMontage') == 1) {

                    if (ch_in_montage == 0) {
                        chDiv = $("<div class='ChDiv'><span id= '" + id + "' >" + ch + "</span></div>");
                        chDiv.addClass('OthersDeactivate');
                    } else {
                        chDiv = $("<div class='ChDiv OtherSpan'>" + ch + " (" + ch_dic[ch].channel_units + ")\nmin - max <span id= '" + id + "' class='OtherSpan OtherPlotMinMaxSpan' style='' >(" + min_max + ")</span></div>");
                    }

                    chDiv.attr("id", ch + '_div')
                    chDiv.css("height", EEGchDivHieght);
                    if (EEGchDivHieght > 200) {
                        chDiv.css("padding-top", EEGchDivHieght / 3);
                    } else {
                        chDiv.css("padding-top", 0);
                    }

                    chDiv.css("padding-left", 5);
                    chDiv.css("background-color", '#dba436');
                    chDiv.css("color", '#222222');
                    chDiv.css("font-weight", 'bold');

                    $('#OtherchName').append(chDiv);
                } else {
                    if (ch_in_montage == 1) {
                        $('#' + id).html("(" + min_max + ")");
                    }
                }
                domin = domin - seg;

            };
        };
        $("#montage").data('plotMontage', 0);
    }
    edf.plotting = 0;
};