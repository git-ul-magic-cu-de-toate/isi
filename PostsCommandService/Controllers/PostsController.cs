using MediatR;
using Microsoft.AspNetCore.Mvc;
using PostsCommandService.Commands.CreatePost;
using PostsCommandService.Controllers.Requests;

namespace PostsCommandService.Controllers;

[ApiController]
[Route("api/v1/posts")]
public class PostsController : ControllerBase
{
    private readonly IMediator _mediator;

    public PostsController(IMediator mediator)
    {
        _mediator = mediator;
    }
    
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PostRequest request)
    {
        var command = new CreatePostCommand
        {
            Title = request.Title,
            Content = request.Content,
            Author = request.Author,
        };
        
        var response = await _mediator.Send(command);
        return response ? 
            Ok() :
            BadRequest("Unable to create the new post");
    }
}