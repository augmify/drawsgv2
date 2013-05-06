window.addEventListener('load', function(e) {
    setTimeout(function() {
        window.scrollTo(0, 1);
        var width = window.innerWidth - 10;
        var height = window.innerHeight - 41 - 52 - 12;
        $("#drawingview").css('width', width + 'px');
        $("#drawingview").css('height', height + 'px');
        $("#canvas").css('width', width + 'px');
        $("#canvas").css('height', height - 30 + 'px');
        $("#slider").css('width', width + 'px');
        $("#slider").css('height', height - 30 + 'px');
        
        $("#back").click(function() {
            window.location.href = '/';
        });
        $("#save").click(function() {

            //show saving modal
            $("#info").html("<span>saving</span><div id='loading'></div>");
            //$("#overlay").animate({opacity: 1}, 300, "ease").show();
            var is_touch_device = function() {
                return !!('ontouchstart' in window) ? 1 : 0;
            };

            function post_to_url(path, params, method) {
                // Set method to post by default, if not specified.
                method = method || "post";

                var form = document.createElement("form");
                form.setAttribute("method", method);
                form.setAttribute("action", path);

                for (var key in params) {
                    if (params.hasOwnProperty(key)) {
                        var hiddenField = document.createElement("input");
                        hiddenField.setAttribute("type", "hidden");
                        hiddenField.setAttribute("name", key);
                        hiddenField.setAttribute("value", params[key]);

                        form.appendChild(hiddenField);
                    }
                }

                document.body.appendChild(form);
                form.submit();
            }


            var submitcaption = function(savedImgid) {

                //validate
                var caption = $("#captiontext").val();
                if (caption.length === 0) {
                    // allow empty submission?
                }

                //submit. (synchronous)
                post_to_url("/draw", {
                    caption: caption,
                    imgid: savedImgid
                });
            };
            var cancel = function() {
                //$("#overlay").animate({opacity: 0}, 300, "ease");
                setTimeout(function() {
                    $("#overlay").hide();
                }, 300);
            };

            //save image.
            var image = $('.literally').canvasForExport().toDataURL("image/png"); //this.drawingview.canvas.el.toDataURL("image/png");

            //error checking.
            if (image.length < 10) {
                // error, invalid image.
                return;
            }

            var that = this;

            //post image.
            $.post('/image', {
                image: image
            }, function(response) {
                //error checking on server side
                if (response.status === "error") {
                    //display error
                    var errortemplate = _.template("<div id='error'><%= message %></div>");
                    $("#overlay").html(errortemplate({message: response.message}));

                    setTimeout(function() {
                        //$("#overlay").animate({opacity: 0}, 500, "ease");
                        setTimeout(function() {
                            $("#overlay").hide();
                        }, 500);
                    }, 2000);
                    return;
                }

                that.imgid = response.imgid;
                //add caption
                var caption = _.template("<div id='caption'><div id='close'></div><a id='title'>Add a Caption!</a><textarea id='captiontext' autofocus name='caption'></textarea><a id='submit'>Submit</a></div>");
                $("#overlay").html(caption()).show();

                $("#captiontext").focus();

                //bind events to submit button.

                $("#submit").on('click', function() {
                    submitcaption(response.imgid);
                });
                $("#close").on('click', function() {
                    cancel();
                });

                //redirect to image page (view + share)
            }, "json");

        });
        $('#drawingview').literallycanvas({imageURLPrefix: '/img', backgroundColor: 'white'});
        setTimeout(function() {
            $("#overlay").hide();
        }, 300);
        
        $pensizeinput = $("#pensizepicker").find("input");
        $pensizeval = $("#pensizepicker").find(".brush-width-val");
        $pensizeinput.change(function(e) {
            var strokeWidth = parseInt($(e.currentTarget).val(), 10);
            $pensizeval.html("(" + strokeWidth + " px)");
            $('.literally').setPenStrokeWidth(strokeWidth);
        });
        $erasersizeinput = $("#erasersizepicker").find("input");
        $erasersizeval = $("#erasersizepicker").find(".brush-width-val");
        var $pab = $("#pen-attribute-box");
        var $eab =  $("#erasor-attribute-box");
        $erasersizeinput.change(function(e) {
            var strokeWidth = parseInt($(e.currentTarget).val(), 10);
            $erasersizeval.html("(" + strokeWidth + " px)");
            $('.literally').setEraserStrokeWidth(strokeWidth);
        });
        $('.tools .button').click(function(){
            $pab.hide();
            $eab.hide();
        });
        var pencil= $('.tool-pencil');
        $(".tool-pencil, .tool-line").click(function() {
            $pab.show();
        });
        $(".tool-eraser").click(function() {
            $eab.show();
        });
        addCodePenMenuEffect();
        
    }, 1);
});

function addCodePenMenuEffect() {
    $(".flyout-btn").click(function() {
        $(".flyout-btn").toggleClass("btn-rotate");
        $(".flyout").find("a").removeClass();
        $(".flyout").removeClass("flyout-init fade").toggleClass("expand");
    });
    $(".flyout").find("a").click(function() {
        $(".flyout-btn").toggleClass("btn-rotate");
        $(".flyout").removeClass("expand").addClass("fade");
        $(this).addClass("clicked");
    });

}
