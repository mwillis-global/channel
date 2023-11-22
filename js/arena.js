(function() {
  var addImagePost, addLinkPost, addMediaPost, addPost, addTextPost, buildQuery, getTemplate, loadPosts, loading, nextPage, posts, queryOptions, settings;

  $(function() {
    return nextPage();
  });

  settings = {
    channelslug: "channel-1l2my4k9a-y"
  };

  posts = [];

  queryOptions = {
    page: 0,
    direction: "desc",
    sort: "position",
    per: 9
  };

  loading = false;

  nextPage = function() {
    queryOptions.page++;
    return loadPosts(buildQuery());
  };

  buildQuery = function() {
    var query;
    return query = "https://api.are.na/v2/channels/" + settings.channelslug + "/contents?" + ($.param(queryOptions));
  };

  loadPosts = function(url) {
    $("#loading").removeClass("not-visible").addClass("is-visible");
    return $.getJSON(url, function(response) {
      var i, len, post, ref;
      ref = response.contents;
      for (i = 0, len = ref.length; i < len; i++) {
        post = ref[i];
        addPost(post);
      }
      loading = false;
      return $("#loading").removeClass("is-visible").addClass("not-visible");
    }).fail(function(jqxhr, textStatus, error) {
      console.log(jqxhr, textStatus, error);
      console.log(jqxhr.statusCode());
      return $("#loading").text(textStatus + ", " + error);
    });
  };

  addPost = function(post) {
    var mediacontainer, template;
    template = getTemplate("#postTemplate");
    template.attr("id", post.id);
    mediacontainer = $("#mediacontainer", template);
    switch (post["class"]) {
      case "Image":
        mediacontainer.html(addImagePost(post));
        break;
      case "Text":
        mediacontainer.html(addTextPost(post));
        break;
      case "Media":
        mediacontainer.html(addMediaPost(post));
        break;
      case "Link":
        mediacontainer.html(addLinkPost(post));
        break;
      default:
        console.log("unknown post type", post["class"], post);
    }
    posts.push(post);
    return $("#posts-container").append(template);
  };

  addImagePost = function(post) {
    var imageTemplate;
    imageTemplate = getTemplate("#imageTemplate");
    if (post.generated_title !== "Untitled") {  
    $(".post-title", imageTemplate).html(post.generated_title);
    }
    $(".post-desc", imageTemplate).html(post.description_html);
    $("a.block", imageTemplate).attr("href", 'https://www.are.na/block/' + post.id);
    $("img", imageTemplate).attr("src", post.image.original.url);
    return imageTemplate;
  };

  addTextPost = function(post) {
    var textTemplate;
    textTemplate = getTemplate("#textTemplate");
    if (post.generated_title !== "Untitled") {
    $(".post-title", textTemplate).text(post.generated_title);
    }
    $("a.block", textTemplate).attr("href", 'https://www.are.na/block/' + post.id);
    $(".post-content", textTemplate).html(post.content_html);
    return textTemplate;
  };

  addMediaPost = function(post) {
    var mediaTemplate;
    mediaTemplate = getTemplate("#mediaTemplate");
    if (post.generated_title !== "Untitled") {  
    $(".post-title", mediaTemplate).html(post.generated_title);
    }
    $(".post-desc", mediaTemplate).html(post.description_html);
    $("img", mediaTemplate).attr("src", post.image.thumb.url);
    $("a", mediaTemplate).attr("href", post.source.url);
    $(".post-source span", mediaTemplate).html(post.source.url);
    return mediaTemplate;
  };

  addLinkPost = function(post) {
    var template;
    template = getTemplate("#linkTemplate");
    if (post.generated_title !== "Untitled") {  
    $(".post-title", template).html(post.generated_title);
    }
    $(".post-desc", template).html(post.description_html);
    $("img", template).attr("src", post.image.large.url);
    $("a", template).attr("href", post.source.url);
    $(".post-source span", template).html(post.source.url);
    return template;
  };

  getTemplate = function(type) {
    var template;
    template = $(type).clone();
    return template.attr("id", null);
  };

  window.addEventListener("scroll", (function(_this) {
    return function(e) {
      var dif, docHeight, scrollTop, winHeight;
      if (posts.length) {
        scrollTop = $(window).scrollTop();
        docHeight = $(document).height();
        winHeight = $(window).height();
        dif = docHeight - winHeight;
        if (scrollTop > dif - winHeight * 2) {
          if (!loading) {
            loading = true;
            return nextPage();
          }
        }
      }
    };
  })(this));

}).call(this);
