$('#DCbtn').data('DCremoval',1);
$('#_60Hz').data("_60Hz", 0 );
$('#_50Hz').data("_50Hz", 0 );
$('#refrential').data('refrentialCh',0);
$('#invert').data('invertCh',1);
$('.window1s').data('windowduration',1);
$('.window3s').data('windowduration',3);
$('.window7s').data('windowduration',7);
$('.window10s').data('windowduration',10);
$('.window15s').data('windowduration',15);
$('.window30s').data('windowduration',30);
$('.window60s').data('windowduration',60);
$('#windowduratin').data('window_duration',7);
$("#channel_labels_one").data('chlist',[]);
$("#montage_EEG_list").data('montage',[]);
$("#montage_EKG_list").data('montage',[]);
$("#montage_other_list").data('montage',[]);
$("#montage").data('plotMontage',1);
$('.amp1s').data('amplitudeCalibration',1);
$('.amp2s').data('amplitudeCalibration',2);
$('.amp3s').data('amplitudeCalibration',3);
$('.amp5s').data('amplitudeCalibration',5);
$('.amp7s').data('amplitudeCalibration',7);
$('.amp10s').data('amplitudeCalibration',10);
$('.amp15s').data('amplitudeCalibration',15);
$('.amp20s').data('amplitudeCalibration',20);
$('.amp30s').data('amplitudeCalibration',30);
$('.amp50s').data('amplitudeCalibration',50);
$('.amp100s').data('amplitudeCalibration',100);
$('#amp').data('amplitudeCalibration',5);
$('#GO').data('tab',1);
var ch_dic = {};
var edf = {};
$('#montage').click(function() {
$('#montageModal').modal('show');
});
$('#aboutbtn').click(function() {
$('#aboutmodal').modal('show');
});
$('#Documentationbtn').click(function() {
window.open('https://bilalzonjy.github.io/doc/EDFViewer/doc.html', '_blank');
});
function sizeChanged(argument) {
  if(edf.fileName){
  $("#montage").data('plotMontage',1);
  readEEG();}
}
$('#startWindowtime').click(function() {
  try{
  var datetime = edf.date_time.clone()
  datetime = datetime.format("YYYY-MM-DD");
  var endTimedatetime = edf.date_time.clone();
  endTimedatetime.add(edf.file_duration, 'seconds');
  endTimedatetime = endTimedatetime.format("YYYY-MM-DD"); 
  if (moment(endTimedatetime).isSame(datetime)){
    $('#date_Clock').hide();
  }else{
    $('#date_Clock').show();
    $('#date_Clock').css('max',endTimedatetime);
    $('#date_Clock').css('min',datetime);
  }
  datetime = edf.date_time.clone();
  var t_beg = edf.t_beg ;
  var st_date_time = datetime.add(t_beg, 'seconds');
  $('#date_Clock').val(st_date_time.format("YYYY-MM-DD"));
  $('#HH_Clock').val(st_date_time.format("HH"));
  $('#mm_Clock').val(st_date_time.format("mm"));
  $('#ss_Clock').val(st_date_time.format("ss"));
  $('#ClockTimeli').click(function() {$('#GO').data('tab',1);});
  $('#ElapsTimeli').click(function() {$('#GO').data('tab',2);});
  $('#Elapssecondsli').click(function() {$('#GO').data('tab',3);});
  var totalSeconds = t_beg;
  var hours = Math.floor(totalSeconds / 3600);
  totalSeconds %= 3600;
  var minutes = Math.floor(totalSeconds / 60);
  var seconds = totalSeconds % 60;
  $('#HH_Elaps').val(hours);
  $('#mm_Elaps').val(minutes);
  $('#ss_Elaps').val(seconds);
  $('#seconds_Elaps').val(t_beg);
  $('#seconds_Elaps').css('max',edf.file_duration - 1);
  $('#jumptomodal').modal('show');
  }catch(err){};
});

$('.amplitSelect').click(function() {
  if (edf.ampAutoChanging == 1){return};
  var amp = $(this).data('amplitudeCalibration');
  $('#amp').data("amplitudeCalibration", amp );
  $('#ampNumber').text(amp+' µV ');
  if(edf.fileName){readEEG();};
});


$('.HH').on('input',function(){
  if($(this).val() > 23){
    $(this).val(23);
  }else if ($(this).val() < 0){
    $(this).val(0);
  }
  });
$('.60').on('input',function(){
  if($(this).val() > 59){
    $(this).val(59);
  }else if ($(this).val() < 0){
    $(this).val(0);
  }
  });
$('.seconds').on('input',function(){
  if (edf.file_duration){
  try{
  if($(this).val() > edf.file_duration - 1){
    $(this).val(edf.file_duration-1);
  }else if ($(this).val() < 0){
    $(this).val(0);
  }
  }catch(err){
  }}else{$(this).val(0);}
  });


$('#GO').click(function() {
  var tab = $(this).data('tab');
  if (tab == 1){
    var datetime = edf.date_time.clone();
    var endTimedatetime = edf.date_time.clone();
    endTimedatetime = endTimedatetime.add(edf.file_duration, 'seconds');
    var enterecClock = moment($('#date_Clock').val() +'-'+$('#HH_Clock').val()+'-'+$('#mm_Clock').val()+'-'+$('#ss_Clock').val(),"YYYY-MM-DD-HH-mm-ss");
    if (enterecClock.diff(endTimedatetime, 'seconds') <-1){
      var t_beg = enterecClock.diff(datetime, 'seconds');
      if (t_beg >=0){
      edf.t_beg =   parseInt(t_beg);
      Jump();
    }else{alert('File begins at ' + datetime.format("YYYY-MM-DD HH:mm:ss")+'\nPlease enter a valid time')}
    }else{
      alert('File ends at ' + endTimedatetime.format("YYYY-MM-DD HH:mm:ss")+'\nPlease enter a valid time')
    }
  }else if (tab == 2){
    var t_beg =  parseInt($('#HH_Elaps').val()) * 3600 + parseInt($('#mm_Elaps').val()) * 60 + parseInt($('#ss_Elaps').val());
    if (edf.file_duration > (t_beg-2)){
      edf.t_beg =   parseInt(t_beg);
      Jump();
    }else{
      totalSeconds = edf.file_duration;
      var hours = Math.floor(totalSeconds / 3600);
      totalSeconds %= 3600;
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = totalSeconds % 60;
      alert("File's duration is \n"+hours+' hour '+minutes+' minutes '+seconds+' seconds '+'\nPlease enter a valid time');
    }
  }else if (tab == 3){
    var t_beg =  parseInt($('#seconds_Elaps').val());
        if (edf.file_duration > (t_beg-2)){
      edf.t_beg =   parseInt(t_beg);
      Jump();
    }else{
      alert("File's duration is "+edf.file_duration - 1 +' seconds '+'\nPlease enter a valid number');
    }
   }
});


$(document).on('input', '#rangeinput', function() {
    edf.t_beg =   parseInt($(this).val());
    Jump(); 
});


function Jump() {
    const window_duration =   parseInt($('#windowduratin').data("window_duration"));
    var t_beg = edf.t_beg;
    var end = edf.file_duration;
    var t_end =  t_beg +  window_duration;
    if  (t_end >= end-1){
        t_beg = end-window_duration;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
  if(edf.fileName){readEEG();};
  }
document.onkeyup = function(e) {
    if (edf.plotting ==0 ){
    switch (e.keyCode) {
        case 37:
            previousPage();
            return;
        case 38:
            var amp = $('#amp').data('amplitudeCalibration');
            var ampList = [1,2,3,5,7,10,15,20,30,50,100];
            var ampind = ampList.indexOf(amp);
            if (ampind>0){
              amp = ampList[ampind - 1];
              edf.ampAutoChanging = 1;
              $('#amp').data('amplitudeCalibration',amp);
              $('.amplitSelect').prop( "checked", false );
              $('#ampNumber').text(amp+' µV ');
              $('.amp'+amp+'s').prop( "checked", true );
              edf.ampAutoChanging = 0;
              if(edf.fileName){readEEG();};
            }
            return;
        case 39:
            nextPage();
            return
        case 40:
            var amp = $('#amp').data('amplitudeCalibration');
            var ampList = [1,2,3,5,7,10,15,20,30,50,100];
            var ampind = ampList.indexOf(amp);
            if (ampind<ampList.length-1){
              amp = ampList[ampind + 1];
              edf.ampAutoChanging = 1;
              $('#amp').data('amplitudeCalibration',amp);
              $('.amplitSelect').prop( "checked", false );
              $('#ampNumber').text(amp+' µV ');
              $('.amp'+amp+'s').prop( "checked", true );
              edf.ampAutoChanging = 0;
              if(edf.fileName){readEEG();};
            }
            return;
    }}

};
$('#DCbtn').click(function() {
  if ($(this).data('DCremoval') == 1){
      $(this).data("DCremoval", 0 );
      $(this).css('aria-pressed','false');
      $('#CDspan').removeClass('glyphicon-check');
      $('#CDspan').addClass('glyphicon-unchecked');
      if(edf.fileName){readEEG();};
  }else{
      $(this).data("DCremoval", 1 );
      $(this).css('aria-pressed','true');
      $('#CDspan').removeClass('glyphicon-unchecked');
      $('#CDspan').addClass('glyphicon-check');
      if(edf.fileName){readEEG();};
  }
});


$('#_60Hz').click(function() {
  if ($(this).data('_60Hz') == 1){
      $(this).data("_60Hz", 0 );
      $(this).css('aria-pressed','false');
      $('#60span').removeClass('glyphicon-check');
      $('#60span').addClass('glyphicon-unchecked');
      if(edf.fileName){readEEG();};
  }else{
      $(this).data("_60Hz", 1 );
      $(this).css('aria-pressed','true');
      $('#60span').removeClass('glyphicon-unchecked');
      $('#60span').addClass('glyphicon-check');
      if(edf.fileName){readEEG();};
  }
});


$('#_50Hz').click(function() {
  if ($(this).data('_50Hz') == 1){
      $(this).data("_50Hz", 0 );
      $(this).css('aria-pressed','false');
      $('#50span').removeClass('glyphicon-check');
      $('#50span').addClass('glyphicon-unchecked');
      if(edf.fileName){readEEG();};
  }else{
      $(this).data("_50Hz", 1 );
      $(this).css('aria-pressed','true');
      $('#50span').removeClass('glyphicon-unchecked');
      $('#50span').addClass('glyphicon-check');
      if(edf.fileName){readEEG();};
  }
});
$('#refrential').click(function() {
  if ($(this).data('refrentialCh') == 1){
      $(this).data("refrentialCh", 0 );
      $(this).css('aria-pressed','false');
      $('.channel2Group').show();
      $('#refrentialspan').removeClass('glyphicon-check');
      $('#refrentialspan').addClass('glyphicon-unchecked');
  }else{
      $(this).data("refrentialCh", 1 );
      $(this).css('aria-pressed','true');
      $('.channel2Group').hide();
      $('#refrentialspan').removeClass('glyphicon-unchecked');
      $('#refrentialspan').addClass('glyphicon-check');
  }
});
$('#invert').click(function() {
  if ($(this).data('invertCh') == 1){
      $(this).data("invertCh", -1 );
      $(this).css('aria-pressed','true');
      $('#invertspan').removeClass('glyphicon-unchecked');
      $('#invertspan').addClass('glyphicon-check');
  }else{
      $(this).data("invertCh", 1 );
      $(this).css('aria-pressed','false');
      $('#invertspan').removeClass('glyphicon-check');
      $('#invertspan').addClass('glyphicon-unchecked');
  }
});
$('.windowSelect').click(function() {
  try{
  var duration = $(this).data('windowduration');
  $('#windowduratin').data("window_duration", duration );
  $('#wd').text(duration+'s ');
  var scroll_marker_width =(parseInt($('#scroll_body').width())*parseInt($('#windowduratin').data("window_duration")))/edf.file_duration;
  if (scroll_marker_width<3){scroll_marker_width = 3}; 
  $('#scroll_marker').css('width',scroll_marker_width);
    var t_beg = edf.t_beg ;    
    var end = edf.record_duration*edf.records_count;
    var t_end = t_beg + duration;
    if  (t_end >= end-1){
        t_beg = end-duration;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    if(edf.fileName){readEEG();};
    }catch(err){};
});

$(window).scroll(function() { 
    $('#montageMiddle').css('top', $(this).scrollTop());
});
$('#next_page').on('click', function() {
  nextPage();
})
$('#next_sec').on('click', function() {
    try{
    const window_duration =  $('#windowduratin').data("window_duration");
    var t_beg = edf.t_beg + 1;    
    var end = edf.record_duration*edf.records_count;
    var t_end = t_beg + window_duration;
    if  (t_end >= end-1){
        t_beg = end-window_duration;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    readEEG();
    }catch(err){};
})
$('#previous_sec').on('click', function() {
  try{
    const window_duration =  $('#windowduratin').data("window_duration");
    var t_beg = edf.t_beg - 1;    
    var end = edf.record_duration*edf.records_count;
    var t_end = edf.t_beg;
    if  (t_beg <0 ){
        t_beg = 0;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    readEEG();
    }catch(err){};
})


$('#previous_page').on('click', function() {
  previousPage();
})
function nextPage() {
try{
    const window_duration =  $('#windowduratin').data("window_duration");
    var t_beg = edf.t_beg + window_duration;    
    var end = edf.record_duration*edf.records_count;
    var t_end = t_beg + window_duration;
    if  (t_end >= end-1){
        t_beg = end-window_duration;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    readEEG();
    }catch(err){};
}

function previousPage() {
      try{
    const window_duration =  $('#windowduratin').data("window_duration");
    var t_beg = edf.t_beg - window_duration;    
    var end = edf.record_duration*edf.records_count;
    var t_end = edf.t_beg;
    if  (t_beg <0 ){
        t_beg = 0;
        }
    edf.t_beg =  parseInt(t_beg);
    t_end = edf.t_beg+window_duration;
    var datetime = edf.date_time.clone();
    var st_date_time = datetime.add(t_beg, 'seconds');
    $('#DateTime').text(st_date_time.format("YYYY-MM-DD"));
    $('#startWindowtime').text(st_date_time.format("HH:mm:ss"));
    datetime = edf.date_time.clone();
    var end_date_time = datetime.add(t_end, 'seconds');
    $('#endWindowtime').text(end_date_time.format("HH:mm:ss"));
    readEEG();
    }catch(err){};
}

function analysis_header(e){
  if (!e.target.files[0]) {
    return;
  };
ch_dic = {};
edf = {};
 edf.fileName = e.target.files[0];
  $( "#EEGDiv" ).remove();
  $( "#EKGDiv" ).remove();
  $( "#otherDiv" ).remove();
  $("#EEGMontage").data('ch1',null);
  $("#EEGMontage").data('ch2',null);
  $("#EKGMontage").data('ch1',null);
  $("#EKGMontage").data('ch2',null);
  $("#OtherMontage").data('ch1',null);
  $("#OtherMontage").data('ch2',null);
  read_Header()
  .then(Analysis_Header_First_Section)
  .then(Analysis_Header_Second_Section)
  .then(Assess_montage);
}
function read_Header(){
    return new Promise(function(resolve, reject){
      var start = 1;
      var stop = 250;
      var file = edf.fileName;
      var reader = new FileReader();
      var blob = file.slice(start, stop);
      reader.readAsBinaryString(blob);
      return reader.onloadend = function () { 
              var data = reader.result.trim();
              resolve(data);
              };       
    });
    }
function Analysis_Header_First_Section(data){
    return new Promise(function(resolve, reject){
        edf.local_patient_id    =            data.slice(0  , 80 ).trim()  ;
        edf.local_recording_id  =            data.slice(80 , 160).trim()  ;
        edf.start_date          =            data.slice(160, 168).trim()  ;
        edf.start_time          =            data.slice(168, 176).trim()  ;
        edf.header_bytes_count  = parseFloat(data.slice(176, 184).trim() );
        edf.reserved            =            data.slice(184, 228).trim()  ;
        edf.records_count       = parseFloat(data.slice(228, 236).trim() );
        edf.record_duration     = parseFloat(data.slice(236, 244).trim() );
        $('#ptname').text(edf.local_recording_id);
        var year  = parseFloat(edf.start_date.slice(6));
        if(year >= 85 ){ year = 1900 + year;}else{ year = 2000 + year;}
        edf.date_time = moment(edf.start_date.slice(0,2) + '-'+edf.start_date.slice(3,5)+'-'+year + ' ' +  edf.start_time .replace('.',':'),"DD-MM-YYYY HH:mm:ss")
        $('#DateTime').text(edf.date_time.format("YYYY-MM-DD"));
        var window_dur =  $('#windowduratin').data("window_duration");
        $('#startWindowtime').text(edf.date_time.format("HH:mm:ss"));
        var endwindow = edf.date_time.clone();
        endwindow = endwindow.add(window_dur, 'seconds');
        $('#endWindowtime').text(endwindow.format("HH:mm:ss"));
        edf.t_beg = 0;
        edf.file_duration = edf.records_count * edf.record_duration;
        $('#rangeinput').attr('max', edf.file_duration);
        const window_duration =  $('#windowduratin').data("window_duration");
        var scroll_marker_width =(parseInt($('#scroll_body').width())*parseInt($('#windowduratin').data("window_duration")))/edf.file_duration;
        if (scroll_marker_width<3){scroll_marker_width = 3};  
        $('#scroll_marker').css('width',scroll_marker_width);
        $('#scroll_marker').css('left','0');
        resolve(data);
    });
  }
function Analysis_Header_Second_Section(data){
    return new Promise(function(resolve, reject){
        var start = 250;
        var stop = edf.header_bytes_count;
        stop++;
        var file = edf.fileName;
        var reader = new FileReader();
        var blob = file.slice(start, stop);
        reader.readAsBinaryString(blob);
        return reader.onloadend = function () { 
                var data = reader.result.trim();
                var pointer = 4;
                var ch_samp_offsets = 0;
                var samples_per_record =0;
                edf.channels_count      = parseFloat(data.slice(0, pointer).trim() );
                pointer = analysis_header_ch(data,'channel_labels',16,pointer);
                pointer = analysis_header_ch(data,'channel_trans',80,pointer);
                pointer = analysis_header_ch(data,'channel_units',8,pointer);
                pointer = analysis_header_ch(data,'channel_phys_minimums',8,pointer);
                pointer = analysis_header_ch(data,'channel_phys_maximums',8,pointer);
                pointer = analysis_header_ch(data,'channel_dig_minimums',8,pointer);
                pointer = analysis_header_ch(data,'channel_dig_maximums',8,pointer);
                pointer = analysis_header_ch(data,'channel_prefilterings',80,pointer);
                pointer = analysis_header_ch(data,'channel_samples_per_record',8,pointer);
                pointer = analysis_header_ch(data,'channel_reserved',32,pointer);
                var channelslist = $("#channel_labels_one").data('chlist');
                edf.keepmontage=0;
                var montage_EEG_list = $("#montage_EEG_list").data('montage');
                var montage_EKG_list = $("#montage_EKG_list").data('montage');
                var montage_other_list = $("#montage_other_list").data('montage');
                if (montage_EEG_list.length > 0 || montage_EKG_list.length > 0 || montage_other_list.length > 0 ){
                  edf.keepmontage = 1;
                }
                for(i in montage_EEG_list){
                  for (c in montage_EEG_list[i]){
                    if (!edf.channel_labels.includes(montage_EEG_list[i][c])){edf.keepmontage=0;}
                  }
                }
                for(i in montage_EKG_list){
                  for (c in montage_EKG_list[i]){
                    if (!edf.channel_labels.includes(montage_EKG_list[i][c])){edf.keepmontage=0;}
                  }
                }
                for(i in montage_other_list){
                  for (c in montage_other_list[i]){
                    if (!edf.channel_labels.includes(montage_other_list[i][c])){edf.keepmontage=0;}
                  }
                }
                $('#montagbtngroup').css('height',360);
                $('.montageWindowName').remove();
                $("#channel_labels_one").data('chlist',edf.channel_labels);
                if (edf.keepmontage==0) {
                  $("#montage_EEG_list").data('montage',[]);
                  $("#montage_EKG_list").data('montage',[]);
                  $("#montage_other_list").data('montage',[]);
                  $('.montageall').remove();
                  $("#montage").data('plotMontage',1);
                  $(".ChDiv").remove();
                };

                var ht  = $('#montagbtngroup').height();
                for (i in edf.channel_labels){
                  if (edf.channel_labels[i] !='' ){
                  var Chlbl = $('<label class="btn btn-success montageChannel_1 montageWindowName"><input type="radio" name="ch1"  autocomplete="off">'+edf.channel_labels[i] +'</label>')
                  Chlbl.data('ch',edf.channel_labels[i] );
                  Chlbl.data('checked','false');
                  Chlbl.css('width',120);
                  Chlbl.css('margin-top',5);
                  Chlbl.css('margin-bottom',5);
                  Chlbl.css('padding-left',0);
                  Chlbl.css('text-align','left');
                  $('#channel_labels_one').append(Chlbl);
                  var Chlb2 = $('<label class="btn btn-success montageChannel_2 montageWindowName"><input type="radio" name="ch2" autocomplete="off">'+edf.channel_labels[i] +'</label>')
                  Chlb2.data('ch',edf.channel_labels[i] );
                  Chlb2.data('checked','false');
                  Chlb2.css('width',120);
                  Chlb2.css('margin-top',5);
                  Chlb2.css('margin-bottom',5);
                  Chlb2.css('padding-left',0);
                  Chlb2.css('text-align','left');
                  $('#channel_labels_two').append(Chlb2);
                  ht  = $('#montagbtngroup').height();
                  $('#montagbtngroup').css('height',ht+40 );
                };
                  ch_dic[edf.channel_labels[i]] = {
                    channel_trans           :edf.channel_trans[i],
                    channel_units           :edf.channel_units[i],
                    channel_phys_minimums   :parseFloat(edf.channel_phys_minimums[i]),
                    channel_phys_maximums   :parseFloat(edf.channel_phys_maximums[i]),
                    channel_dig_minimums    :parseFloat(edf.channel_dig_minimums[i]),
                    channel_dig_maximums    :parseFloat(edf.channel_dig_maximums[i]),
                    channel_prefilterings   :edf.channel_prefilterings[i],
                  channel_samples_per_record:parseFloat(edf.channel_samples_per_record[i]),
                    channel_reserved        :edf.channel_reserved[i],
                    channel_sample_rates    :parseFloat(edf.channel_samples_per_record[i])/edf.record_duration,
                    channel_samples_count   :parseFloat(edf.channel_samples_per_record[i])*edf.records_count,
                    channel_physical_ranges :parseFloat(edf.channel_phys_maximums[i]) - parseFloat(edf.channel_phys_minimums[i]),
                    channel_digital_ranges  :parseFloat(edf.channel_dig_maximums[i]) - parseFloat(edf.channel_dig_minimums[i]),
                    channel_scaling_factors : (parseFloat(edf.channel_phys_maximums[i]) - parseFloat(edf.channel_phys_minimums[i]))/(parseFloat(edf.channel_dig_maximums[i]) - parseFloat(edf.channel_dig_minimums[i])),                 
                    channel_block_samples_offset : ch_samp_offsets,
                    channel_block_bytes_offset   : 2 * ch_samp_offsets,
                  };
                  ch_samp_offsets = ch_samp_offsets + parseFloat(edf.channel_samples_per_record[i]);
                  samples_per_record = samples_per_record +  parseFloat(edf.channel_samples_per_record[i]);
                }
                edf.samples_per_record = samples_per_record;
                edf.bytes_per_record = 2*samples_per_record;
                var channel_record_onset = edf.channel_samples_per_record;
                edf.channel_record_onset = [0];
                for (i in channel_record_onset){
                  edf.channel_record_onset.push(parseFloat(channel_record_onset[i]));
                }
                i = 1;
                while (i<edf.channel_record_onset.length){
                  edf.channel_record_onset[i] = edf.channel_record_onset[i-1]+edf.channel_record_onset[i];
                  i++;
                }
                var channel_record_end = edf.channel_record_onset.slice(1);
                channel_record_end.push(edf.samples_per_record);
                edf.channel_record_end = channel_record_end;
                i = 0;
                edf.records_start = [];
                var bytes_offset =  edf.header_bytes_count ;
                while(i< edf.records_count){
                  edf.records_start.push(bytes_offset);
                  bytes_offset = bytes_offset + edf.bytes_per_record ; 
                  i++; 
                }
                for (i in edf.channel_labels){
                  ch_dic[edf.channel_labels[i]]['bytes_per_record_skip'] = 2 * (samples_per_record -ch_dic[edf.channel_labels[i]].channel_samples_per_record);
                }
                ht  = $('#montagbtngroup').height();
                $('#montagbtngroup').css('height',ht-40 );
                resolve(ch_dic);
                };        
    });
  }
function analysis_header_ch(data,ID,bytesnumber,pointer){
            edf[ID] = [];
            var CH_index = 0;
            var point = pointer
            while (CH_index < edf.channels_count){
                  var start = point;
                  var stop = start + bytesnumber;
                  CH_index++;
                  point = stop
                  var ch = data.slice(start, stop).trim()
                  edf[ID].push(ch);
                }
            return(point);
}
function Assess_montage(data){
    return new Promise(function(resolve, reject){
      if (edf.keepmontage==0){
            $('#montageModal').modal('show'); 
            resolve(data); 
              }else{
                resolve(readEEG());
              };       
    });
    }
document.getElementById('file-input').addEventListener('change', analysis_header, false);  
$(document).on('click', '.montageChannel_1', function() {
  var cho = $(this).data('ch');
  $("#EEGMontage").data('ch1',cho);
  $("#EKGMontage").data('ch1',cho);
  $("#OtherMontage").data('ch1',cho);
});
$(document).on('click', '.montageChannel_2', function() {
  var cho = $(this).data('ch');
  $("#EEGMontage").data('ch2',cho);
  $("#EKGMontage").data('ch2',cho);
  $("#OtherMontage").data('ch2',cho);
});
$(document).on('click', '.montageall', function() {
  var id = $(this).attr("id");
  var cho = $(this).data('ch');
  var group = $(this).data('montage');
  $("#delelteMontage").data('ch',cho);
  $("#delelteMontage").data('group',group);
  $("#delelteMontage").data('id',id);
});
$("#EEGMontage").on("click", function() {
  var cho1 = $(this).data('ch1');
  var cho2 = $(this).data('ch2');
  if (cho1 !=null){
  var ch;
  var ref = $('#refrential').data('refrentialCh');
  var lbl;
  if (ref == 0 && cho2 !=null){
    if (ch_dic[cho1].channel_sample_rates != ch_dic[cho2].channel_sample_rates){
      alert(cho1 +', '+ cho2 +" don't have the same sampling rate!");
      return;}
    lbl = cho1 +'-'+ cho2;
    ch = [cho1,cho2];
  }else{
    lbl = cho1;
    ch = [cho1];
  }
  var montagedata = $('#montage_EEG_list').data('montage');
  $("#montage").data('plotMontage',1);
  var douplication = 0;
  for(i in montagedata){
    if (ch.toString() == montagedata[i].toString()){
      douplication = 1;
    }
  }
  if (douplication == 1){
    alert(lbl + ' is already exist in the montage')
  }else{
  var Chlbl = $('<label class="btn btn-info montageall "id = '+ch.join("").replace(/\s+/g, '') +'><input type="radio" name="montageall"  autocomplete="off">'+ lbl +'</label>')
  Chlbl.data('ch',ch );
  Chlbl.data('montage','montage_EEG_list');
  Chlbl.data('checked','false');
  Chlbl.css('width',196);
  Chlbl.css('margin-top',5);
  Chlbl.css('margin-bottom',5);
  Chlbl.css('padding-left',0);
  Chlbl.css('text-align','left');
  $('#montage_EEG_list').append(Chlbl);
  montagedata.push(ch);
  $('#montage_EEG_list').data('montage',montagedata);
  };
  }
});
$("#EKGMontage").on("click", function() {
  var cho1 = $(this).data('ch1');
  var cho2 = $(this).data('ch2');
  if (cho1 !=null){
  var ch;
  var ref = $('#refrential').data('refrentialCh');
  var lbl;
  if (ref == 0 && cho2 !=null){
    if (ch_dic[cho1].channel_sample_rates != ch_dic[cho2].channel_sample_rates){
      alert(cho1 +', '+ cho2 +" don't have the same sampling rate!");
      return;}
    lbl = cho1 +'-'+ cho2;
    ch = [cho1,cho2];
  }else{
    lbl = cho1;
    ch = [cho1];
  }
  var montagedata = $('#montage_EKG_list').data('montage');
  $("#montage").data('plotMontage',1);
  var douplication = 0;
  for(i in montagedata){

    if (ch.toString() == montagedata[i].toString()){
      douplication = 1;
    }
  }
  if (douplication == 1){
    alert(lbl + ' is already exist in the montage')
  }else{
  var Chlbl = $('<label class="btn btn-success montageall "id = '+ch.join("").replace(/\s+/g, '') +'><input type="radio" name="montageall"  autocomplete="off">'+ lbl +'</label>')
  Chlbl.data('ch',ch );
  Chlbl.data('montage','montage_EKG_list');
  Chlbl.data('checked','false');
  Chlbl.css('width',196);
  Chlbl.css('margin-top',5);
  Chlbl.css('margin-bottom',5);
  Chlbl.css('padding-left',0);
  Chlbl.css('text-align','left');
  $('#montage_EKG_list').append(Chlbl);
  montagedata.push(ch);
  $('#montage_EKG_list').data('montage',montagedata);
  };
  }
});
$("#OtherMontage").on("click", function() {
  $("#montage").data('plotMontage',1);
  var cho1 = $(this).data('ch1');
  if (cho1 !=null){
  var ch;
  var lbl;
  lbl = cho1;
  ch = [cho1];
  var montagedata = $('#montage_other_list').data('montage');
  var douplication = 0;
  for(i in montagedata){

    if (ch.toString() == montagedata[i].toString()){
      douplication = 1;
    }
  }
  if (douplication == 1){
    alert(lbl + ' is already exist in the montage')
  }else{
  var Chlbl = $('<label class="btn btn-warning montageall " id = '+ch.join("").replace(/\s+/g, '') +'><input type="radio" name="montageall"  autocomplete="off">'+ lbl +'</label>')
  Chlbl.data('ch',ch );
  Chlbl.data('montage','montage_other_list');
  Chlbl.data('checked','false');
  Chlbl.css('width',196);
  Chlbl.css('margin-top',5);
  Chlbl.css('margin-bottom',5);
  Chlbl.css('padding-left',0);
  Chlbl.css('text-align','left');
  $('#montage_other_list').append(Chlbl);
  montagedata.push(ch);
  $('#montage_other_list').data('montage',montagedata);
  };
  }
});
$("#delelteMontage").on("click", function() {
$("#montage").data('plotMontage',1);
var cho =  $(this).data('ch');
var group =   $(this).data('group');
var id = $(this).data('id');
grouparray = $('#'+group).data('montage');
 if (cho !=null){
    var indexTodelete = 0;
    $('#'+id).remove();
    for (i in grouparray){
      if(grouparray[i].toString() == cho.toString() ){
        grouparray.splice(indexTodelete, 1);
      }
      indexTodelete++;
    }
    $('#'+group).data('montage',grouparray);
 }
});
$('#montageModal').on('hidden.bs.modal', function () {
  if(edf.fileName){readEEG();};
});
function CreateTrace(ch,i, col) {         
    var c
    if (i != ''){c= parseInt(i) + 1;}else{c=''};
    var trace = {
      x: [],
      y: [],
      yaxis: 'y'+c,
      name:ch,
      marker:{
      color:col},
      type: 'scatter'
    };
    return trace
}

  function scale (int16_data){
      var p_min = ch_dic[edf.ch].channel_phys_minimums;
      var d_min = ch_dic[edf.ch].channel_dig_minimums;
      var scale = ch_dic[edf.ch].channel_scaling_factors;
      return( scale * ( int16_data - d_min) + p_min);}
function readEEG() {
  $('.showAtbegining').css('visibility','visible');
  $('#scroll_marker').css('left',(parseInt((parseInt($('#scroll_body').width())*edf.t_beg)/edf.file_duration)));
  const montage_EEG_list =  $("#montage_EEG_list").data('montage');
  const montage_EKG_list = $("#montage_EKG_list").data('montage');
  const montage_other_list = $("#montage_other_list").data('montage');
  const EEGlength = montage_EEG_list.length + montage_EKG_list.length + montage_other_list.length;
  if (EEGlength == 0){return};
  const EEGchDivHieght = ($(window).height()-113)/EEGlength;
  const EEGdivHieght = EEGchDivHieght * montage_EEG_list.length;
  var ampfactor = $('#amp').data("amplitudeCalibration");
  var EEGplotamp = EEGdivHieght * ampfactor*0.26;
  var EKGdivHieght = EEGchDivHieght * montage_EKG_list.length;
  const otherdivHieght = EEGchDivHieght * montage_other_list.length;
  if (EKGdivHieght == 0){ EKGdivHieght = 1;};
  var window_duration =  $('#windowduratin').data("window_duration");
  var t_beg = edf.t_beg;
  var t_end =t_beg + $('#windowduratin').data("window_duration");
  if (t_beg >=2){
    t_beg = t_beg -2;
    edf.initial_condition_start = -2;
    }else{
      edf.initial_condition_start=0;
    };
  if (t_end <= edf.file_duration-3){
    t_end = t_end +2;
    edf.initial_condition_end = -2;
    }else{
      edf.initial_condition_end =0;
    }
  window_duration =window_duration+(-1*(edf.initial_condition_start+edf.initial_condition_end));
  const hp = 30;
  var EEG_plotdic = {};
  var EKG_plotdic = {};
  for (i in montage_EEG_list){
    EEG_plotdic[montage_EEG_list[i]] = new CreateTrace(montage_EEG_list[i],'',"#000000");
  }
  for (i in montage_EKG_list){
    EKG_plotdic[montage_EKG_list[i]] = new CreateTrace(montage_EKG_list[i],i,"#000000");
  }
  var plotEEGdata = [];
  var plotEKGdata = [];
  var records_in_window = Math.ceil(window_duration/edf.record_duration)+1;
  var st;
  var end;
  var rec_st;
  var rec_end;
  var c;
  var rec_num;
  for (i in edf.channel_labels){
    ch_dic[edf.channel_labels[i]].bytes_table = [];
    st = edf.channel_record_onset[i];
    end =  edf.channel_record_end[i];
    rec_num = 0;
    while (rec_num <records_in_window){
        rec_st = edf.samples_per_record * rec_num + st;
        rec_end = edf.samples_per_record * rec_num  + end;
        ch_dic[edf.channel_labels[i]].bytes_table.push([rec_st,rec_end]);
        rec_num++;
      }
  }
  function readCh(ch,data){
        var channel = [];
        var _;
        if (ch.length ==1){
          for (i in ch_dic[ch].bytes_table){
            _ = data.slice(ch_dic[ch].bytes_table[i][0],ch_dic[ch].bytes_table[i][1]);
            for (x in _){

              channel.push(_[x]);
            }
          }
        edf.ch=ch;
        channel = channel.map(scale);

      }else{
        var ch1= ch[0];
        var ch2= ch[1];
        var channel_1 = [];
        var channel_2 = [];
        
        for (i in ch_dic[ch1].bytes_table){
          _ = data.slice(ch_dic[ch1].bytes_table[i][0],ch_dic[ch1].bytes_table[i][1]);
          for (x in _){
            channel_1.push(_[x]);
          }
        }
        edf.ch=ch1;
        channel_1 = channel_1.map(scale);
        for (i in ch_dic[ch2].bytes_table){
          _ = data.slice(ch_dic[ch2].bytes_table[i][0],ch_dic[ch2].bytes_table[i][1]);
          for (x in _){
            channel_2.push(_[x]);
          }
        }
      edf.ch=ch2;
      channel_2 = channel_2.map(scale);
      for (i in channel_1){
          channel.push(channel_1[i]-channel_2[i]);
        }
      }
      var str_clip_ch = parseInt(parseFloat(beg_clip_sec)*ch_dic[edf.ch].channel_sample_rates);
      var end_clip_ch = parseInt( channel.length-parseFloat(end_clip_sec)*ch_dic[edf.ch].channel_sample_rates);
      channel = channel.slice(str_clip_ch,end_clip_ch);
      return channel
    }
  edf.plotting = 1;
  var recStart = t_beg/edf.record_duration;
  var recEnd = (window_duration/edf.record_duration) + recStart;
  var rec_beg_frac = recStart - Math.floor(recStart);
  var rec_end_frac =  Math.ceil(recEnd)-recEnd;
  recStart = Math.floor(recStart);
  var beg_clip =  Math.floor(rec_beg_frac*parseFloat(edf.channel_samples_per_record));
  var beg_clip_sec = (rec_beg_frac*edf.record_duration).toFixed(4);
  var end_clip_sec = (rec_end_frac*edf.record_duration).toFixed(4);
  recEnd = Math.ceil(recEnd);
  var end_clip = Math.floor((rec_end_frac)*parseFloat(edf.channel_samples_per_record));
  var start = edf.records_start[recStart];
  var end = edf.records_start[recEnd];
  var reader = new FileReader();
  var blob = edf.fileName.slice(start, end);
  reader.readAsArrayBuffer(blob);
  reader.onloadend = function () { 
      var buf = reader.result;
      var data = new Int16Array(buf);      
      var channel;
      var invert_factor = $('#invert').data('invertCh')*-1;
        $( "#EEGDiv" ).remove();
        $( "#EKGDiv" ).remove();
        $( "#otherDiv" ).remove();
      if ($("#montage").data('plotMontage') == 1){
          $('.ChDiv').remove();
          $('#EEGchName').css('height',EEGdivHieght);
          $('#EKGchName').css('height',EKGdivHieght);
          $('#otherchName').css('height',otherdivHieght);
        }
        var div;
        div = $("<div id ='EEGDiv'></div>");
        div.css("height",EEGdivHieght );
        $('#EEGplot').append(div);  
        div = $("<div id ='EKGDiv'></div>");
        div.css("height",EKGdivHieght );
        $('#EKGplot').append(div);  

        div = $("<div id ='otherDiv'></div>");
        div.css("height",otherdivHieght );
        $('#Otherplot').append(div);       


      var pos = EEGplotamp;
      var seg = EEGplotamp/(montage_EEG_list.length+1);
      for (i in montage_EEG_list){
          ch = montage_EEG_list[i];
          channel =  readCh(ch,data);
          pos = pos - seg;
         if ($('#DCbtn').data('DCremoval')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'HP');};
         if ($('#_60Hz').data('_60Hz')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'_60Hz');};
         if ($('#_50Hz').data('_50Hz')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'_50Hz');};

         for (var i =0;i<channel.length;i++){
            EEG_plotdic[ch].x.push((i/ch_dic[edf.ch].channel_sample_rates)+edf.initial_condition_start);
            EEG_plotdic[ch].y.push((channel[i]*invert_factor)+pos);  
            }        
        plotEEGdata.push(EEG_plotdic[ch]);        

        }
        var layout = {  showlegend: false,
         annotations: []};
        var anno_times = {
        1:[0.2,0.4,0.6,0.8],
        3:[0.5,1,1.5,2,2.5],
        7:[1,2,3,4,5,6],
        10:[2,4,6,8],
        15:[2,4,6,8,10,12,14],
        30:[5,10,15,20,25],
        60:[10,20,30,40,50]
      }
      var annoList = anno_times[$('#windowduratin').data("window_duration")];
      for(a in annoList){
        layout.annotations.push(
        {
          x: annoList[a],
          y: EEGplotamp*0.97,
          showarrow:false,
          text: annoList[a],}
          )
      }

        layout['yaxis'] = {

            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: "",
            showticklabels: false,
            range: [0, EEGplotamp],
          };

      var domin = 1;
      var chDiv;
      for ( i in montage_EEG_list){
        _ = parseInt(i)+1;
        if ($("#montage").data('plotMontage') == 1){
            chDiv = $("<div class='ChDiv'><span style'position:absolute;top:50%;'>"+montage_EEG_list[i].join("-")+"</span></div>");
            chDiv.css("height",EEGchDivHieght);
            chDiv.css("padding-top",EEGchDivHieght/2);
            chDiv.css("padding-left",20);
            chDiv.css("background-color",'#5bc0de');
            chDiv.css("color",'#ffffff');
            chDiv.css("font-weight",'bold');
            $('#EEGchName').append(chDiv);
            }
            domin = domin-seg;
      }
        layout['xaxis'] = {
            range: [0, $('#windowduratin').data("window_duration")],
            gridcolor: '#666666',
          };
        layout.margin =  {
            l: 1,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
            };
      Plotly.plot('EEGDiv', plotEEGdata, layout,{staticPlot: true});
      for (i in montage_EKG_list){
          ch = montage_EKG_list[i];
          channel =  readCh(ch,data);
         if ($('#DCbtn').data('DCremoval')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'HP');};
         if ($('#_60Hz').data('_60Hz')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'_60Hz');};
         if ($('#_50Hz').data('_50Hz')==1){channel = filter(channel,ch_dic[ch[0]].channel_sample_rates,'_50Hz');};
         for (var i =0;i<channel.length;i++){
            EKG_plotdic[ch].x.push((i/ch_dic[ch[0]].channel_sample_rates)+edf.initial_condition_start);
            EKG_plotdic[ch].y.push(channel[i]);    
            }

        plotEKGdata.push(EKG_plotdic[ch]);
        }
        var seg = 1/montage_EKG_list.length;
        var layout = {  showlegend: false,
        };
      var domin = 1;
      var chDiv;
      for ( i in montage_EKG_list){
        _ = parseInt(i)+1;
        layout['yaxis'+_] = {'domain': [domin-seg,domin],
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: false,
            ticks: "",
            showticklabels: false,
          };
        if ($("#montage").data('plotMontage') == 1){
            chDiv = $("<div class='ChDiv'><span style'position:absolute;top:50%;'>"+montage_EKG_list[i].join("-")+"</span></div>");
            chDiv.css("height",EEGchDivHieght);
            chDiv.css("padding-top",EEGchDivHieght/2);
            chDiv.css("padding-left",20);
            chDiv.css("background-color",'#5cb85c');
            chDiv.css("color",'#ffffff');
            chDiv.css("font-weight",'bold');
            $('#EKGchName').append(chDiv);
            }
            domin = domin-seg;
      }
        layout['xaxis'] = {
            range: [0, $('#windowduratin').data("window_duration")],
            gridcolor: '#666666',
          };

        layout.margin =  {
            l: 0,
            r: 0,
            b: 0,
            t: 1,
            pad: 0
            };
  Plotly.plot('EKGDiv', plotEKGdata, layout,{staticPlot: true});
      if (montage_other_list.length > 0){
      var domin = 1;
      var chDiv;
      var seg = 1/montage_other_list.length;
      for (i in montage_other_list){
          
          ch = montage_other_list[i];
          var Trace = new CreateTrace(ch,i,"#000000")
          channel =  readCh(ch,data);
         for (var _ =0;_<channel.length;_++){
              Trace.x.push((_/ch_dic[ch[0]].channel_sample_rates)+edf.initial_condition_start);
              Trace.y.push(channel[_]);    
              }
        var plotdata = [Trace];
        var layout = {  showlegend: false,
        };
        layout['yaxis'] = {
            showgrid: false,
            zeroline: false,
            showline: false,
            autotick: true,
            ticks: "",
            showticklabels: false,
          };
        layout['xaxis'] = {
            range: [0, $('#windowduratin').data("window_duration")],
            gridcolor: '#666666',
          };
            if ($("#montage").data('plotMontage') == 1){
            chDiv = $("<div class='ChDiv'><span style'position:absolute;top:50%;'>"+ ch+"\n(" + ch_dic[ch].channel_units + ")</span></div>");
            chDiv.css("height",EEGchDivHieght);
            chDiv.css("padding-top",EEGchDivHieght/3);
            chDiv.css("padding-left",20);
            chDiv.css("background-color",'#dba436');
            chDiv.css("color",'#ffffff');
            chDiv.css("font-weight",'bold');
            $('#OtherchName').append(chDiv);
            }
            domin = domin-seg;
        layout.margin =  {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
            pad: 0
            };
            var opltDiv = $("<div class='otherplot' id='" + ch+"_plot'></div>");
            opltDiv.css("height",EEGchDivHieght);
            opltDiv.css("padding",0);
            opltDiv.css("margin",0);
            $('#otherDiv').append(opltDiv);
            Plotly.plot(ch + '_plot', plotdata, layout,{displayModeBar: false});
  };
};
    $("#montage").data('plotMontage',0);
    }
edf.plotting = 0;
}