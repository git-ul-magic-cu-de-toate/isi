namespace PostsCommandService.Controllers.Requests;

public sealed class PostRequest
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Author { get; set; }
}