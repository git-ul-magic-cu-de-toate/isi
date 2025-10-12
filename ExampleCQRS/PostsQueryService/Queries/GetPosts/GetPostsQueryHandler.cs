using System.Data;
using Dapper;
using MediatR;
using MySqlConnector;
using PostsQueryService.Entities;

namespace PostsQueryService.Queries.GetPosts;

public sealed class GetPostsQueryHandler : IRequestHandler<GetPostsQuery, List<Post>>
{
    private readonly IDbConnection _dbConnection;
    
    public GetPostsQueryHandler(IConfiguration configuration)
    {
        _dbConnection = new MySqlConnection(configuration.GetConnectionString("DefaultConnection"));
    }
    
    public async Task<List<Post>> Handle(GetPostsQuery request, CancellationToken cancellationToken)
    {
        const string sql = @"SELECT Id, Title, Content, Author 
            FROM Posts";

        // QueryAsync retrieves a list of Post objects
        var posts = await _dbConnection.QueryAsync<Post>(sql);
        return posts.ToList();
    }
}