var HH = 0;//时
var mm = 0;//分
var ss = 0;//秒
var timeState = true;//时间状态 默认为true 开启时间
var questions= QuestionJosn;
var itemList=["A","B","C","D","E","F"]
var activeQuestion=0; //当前操作的考题编号
var questioned = 0; //
var checkQues = []; //已做答的题的集合
/*实现计时器*/
var time = setInterval(function () {
    if (timeState) {
        if (HH == 24) HH = 0;
        str = "";
        if (++ss == 60) {
            if (++mm == 60) { HH++; mm = 0; }
            ss = 0;
        }
        str += HH < 10 ? "0" + HH : HH;
        str += ":";
        str += mm < 10 ? "0" + mm : mm;
        str += ":";
        str += ss < 10 ? "0" + ss : ss;
        $(".time").text(str);
    } else {
        $(".time").text(str);
    }
}, 1000);

//展示考卷信息
function showQuestion(id){
    $(".questioned").text(id+1);
    questioned = (id+1)/questions.length
    if(activeQuestion!=undefined){
        $("#ques"+activeQuestion).removeClass("question_id").addClass("active_question_id");
    }
    activeQuestion = id;
    $(".question").find(".question_info").remove();
    var question = questions[id];
    //标题名称
    $("#title").html("<strong>第 "+(id+1)+" 题 、</strong>"+question.questionTitle);
    //图片视频歌曲
    if('img'==question.questionType){
        $("#itemtype").html("图片");
        $(".img").show();
        $(".img").attr('src',question.questionSource);
        $(".video").hide();
        $(".mp3").hide();
    }else if('mp3'==question.questionType){
        $("#itemtype").html("歌曲");
        $(".mp3").show();
        $(".mp3").attr('src',question.questionSource);
        $(".mp3").trigger('play');//播放
        $(".img").hide();
        $(".video").hide();
    }else{
        $("#itemtype").html("视频");
        $(".video").show();
        $(".video").attr('src',question.questionSource);
        $(".img").hide();
        $(".mp3").hide();
        $(".mp3").trigger('pause');//暂停
    }







    var items = question.questionItems.split(";");
    var item="";
    for(var i=0;i<items.length;i++){
        item ="<li class='question_info' onclick='clickTrim(this)' id='item"
            +i+"'><input type='radio' name='item' value='"+itemList[i]+"'>&nbsp;"+itemList[i]+"."+items[i]+"</li>";
        $(".question").append(item);
    }
    $(".question").attr("id","question"+id);
    $("#ques"+id).removeClass("active_question_id").addClass("question_id");
    for(var i=0;i<checkQues.length;i++){
        if(checkQues[i].id==id){
            $("#"+checkQues[i].item).find("input").prop("checked","checked");
            $("#"+checkQues[i].item).addClass("clickTrim");
            $("#ques"+activeQuestion).removeClass("question_id").addClass("clickQue");
        }
    }
    progress();
}

/*答题卡*/
function answerCard(){
    $(".question_sum").text(questions.length);
    for(var i=0;i<questions.length;i++){
        var questionId ="<li id='ques"+i+"'onclick='saveQuestionState("+i+")' class='questionId'>"+(i+1)+"</li>";
        $("#answerCard ul").append(questionId);
    }
}

/*选中考题*/
var Question;
function clickTrim(source){
    var id = source.id;
    $("#"+id).find("input").prop("checked","checked");
    $("#"+id).addClass("clickTrim");
    $("#ques"+activeQuestion).removeClass("question_id").addClass("clickQue");
    var ques =0;
    for(var i=0;i<checkQues.length;i++){
        if( checkQues[i].id==activeQuestion&&checkQues[i].item!=id){
            ques = checkQues[i].id;
            checkQues[i].item = id;//获取当前考题的选项ID
            checkQues[i].answer =$("#"+id).find("input[name=item]:checked").val();//获取当前考题的选项值
        }
    }
    if(checkQues.length==0||Question!=activeQuestion&&activeQuestion!=ques){
        var check ={};
        check.id=activeQuestion;//获取当前考题的编号
        check.item = id;//获取当前考题的选项ID
        check.answer =$("#"+id).find("input[name=item]:checked").val();//获取当前考题的选项值
        checkQues.push(check);
    }
    $(".question_info").each(function(){
        var otherId =$(this).attr("id");
        if(otherId!=id){
            $("#"+otherId).find("input").prop("checked",false);
            $("#"+otherId).removeClass("clickTrim");
        }
    })
    Question = activeQuestion;
}

/*设置进度条*/
function progress(){
    var prog = ($(".active_question_id").length+1)/questions.length;
    var pro = $(".progress").parent().width() * prog;
    $(".progres").text((prog*100).toString().substr(0,5)+"%")
    $(".progress").animate({
        width: pro,
        opacity: 0.5
    }, 1000);
}

/*保存考题状态 已做答的状态*/
function saveQuestionState(clickId){
    showQuestion(clickId)
}

$(function(){
    $(".middle-top-left").width($(".middle-top").width()-$(".middle-top-right").width())
    $(".progress-left").width($(".middle-top-left").width()-200);
    progress();
    answerCard();
    showQuestion(0);
    /*alert(QuestionJosn.length);*/
    /*实现进度条信息加载的动画*/
    var str = '';
    /*开启或者停止时间*/
    $(".time-stop").click(function () {
        timeState = false;
        $(this).hide();
        $(".time-start").show();
    });
    $(".time-start").click(function () {
        timeState = true;
        $(this).hide();
        $(".time-stop").show();
    });

    /*收藏按钮的切换*/
    $("#unHeart").click(function(){
        $(this).hide();
        $("#heart").show();
    })
    $("#heart").click(function(){
        $(this).hide();
        $("#unHeart").show();
    })

    /*答题卡的切换*/
    $("#openCard").click(function(){
        $("#closeCard").show();
        $("#answerCard").slideDown();
        $(this).hide();
    })
    $("#closeCard").click(function(){
        $("#openCard").show();
        $("#answerCard").slideUp();
        $(this).hide();
    })

    //提交试卷
    $("#submitQuestions").click(function(){
        /*alert(JSON.stringify(checkQues));*/
        alert("已做答:"+($(".clickQue").length)+"道题,还有"+(questions.length-($(".clickQue").length))+"道题未完成");
    })
    //进入下一题
    $("#nextQuestion").click(function(){
        if((activeQuestion+1)!=questions.length) showQuestion(activeQuestion+1);
        showQuestion(activeQuestion)
    })
})
