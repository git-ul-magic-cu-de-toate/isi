using System.Data;
using Dapper;
using ExampleCQRS.IntegrationEvents.Events;
using MassTransit;
using MySqlConnector;
using PostsQueryService.Entities;

namespace PostsQueryService.Consumers;

public sealed class PostCreatedEventConsumer : IConsumer<PostCreatedEvent>
{
    private readonly IDbConnection _dbConnection;
    
    public PostCreatedEventConsumer(IConfiguration configuration)
    {
        _dbConnection = new MySqlConnection(configuration.GetConnectionString("DefaultConnection"));
    }
    
    public async Task Consume(ConsumeContext<PostCreatedEvent> context)
    {
        const string sql = @"
            INSERT INTO Posts (Id, Title, Content, Author, CreatedAt)
            VALUES (@Id, @Title, @Content, @Author, @CreatedAt);";

        var post = new Post
        {
            Title = context.Message.Title,
            Content = context.Message.Content,
            Author = context.Message.Author,
            CreatedAt = context.Message.CreatedAt
        };
        
        await _dbConnection.ExecuteAsync(sql, post);
    }
}