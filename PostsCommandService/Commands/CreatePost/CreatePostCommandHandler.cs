using System.Data;
using Dapper;
using ExampleCQRS.IntegrationEvents.Events;
using MassTransit;
using MediatR;
using MySqlConnector;
using PostsCommandService.Entities;

namespace PostsCommandService.Commands.CreatePost;

internal sealed class CreatePostCommandHandler : IRequestHandler<CreatePostCommand, bool>
{
    private readonly IBus _bus;
    private readonly IDbConnection _dbConnection;
    
    public CreatePostCommandHandler(IConfiguration configuration, IBus bus)
    {
        _bus = bus;
        _dbConnection = new MySqlConnection(configuration.GetConnectionString("DefaultConnection"));
    }
    
    public async Task<bool> Handle(CreatePostCommand request, CancellationToken cancellationToken)
    {
        const string sql = @"
            INSERT INTO Posts (Title, Content, Author, CreatedAt)
            VALUES (@Title, @Content, @Author, @CreatedAt);
            SELECT LAST_INSERT_ID();";

        var post = new Post
        {
            Title = request.Title,
            Content = request.Content,
            Author = request.Author,
            CreatedAt = DateTime.Now
        };
        
        var postId = await _dbConnection.ExecuteScalarAsync<int?>(sql, post);
        if (postId != null)
        {
            var @event = new PostCreatedEvent
            {
                Id = postId.Value,
                Title = post.Title,
                Content = post.Content,
                Author = post.Author,
                CreatedAt = post.CreatedAt
            };
            
            await _bus.Publish(@event, cancellationToken);
            return true;
        }
        
        return false;
    }
}