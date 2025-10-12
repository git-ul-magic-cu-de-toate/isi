using MediatR;

namespace PostsCommandService.Commands.CreatePost;

public sealed class CreatePostCommand : IRequest<bool>
{
    public string Title { get; set; }
    public string Content { get; set; }
    public string Author { get; set; }
}