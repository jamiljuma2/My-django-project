import time
import logging
import uuid
import contextvars

logger = logging.getLogger(__name__)

# Context variable to store correlation id per request/thread
correlation_id_ctx: contextvars.ContextVar[str] = contextvars.ContextVar("correlation_id", default="-")

def get_correlation_id() -> str:
    return correlation_id_ctx.get()

class CorrelationIdMiddleware:
    """
    Reads correlation ID from incoming headers (X-Correlation-ID or X-Request-ID)
    or generates a UUIDv4. Attaches it to request, response headers, and logging context.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        cid = (
            request.headers.get("X-Correlation-ID")
            or request.headers.get("X-Request-ID")
            or str(uuid.uuid4())
        )
        correlation_id_ctx.set(cid)
        # expose on request for views if needed
        request.correlation_id = cid
        response = self.get_response(request)
        # add to response header so clients can trace
        try:
            response["X-Correlation-ID"] = cid
        except Exception:
            pass
        return response

class RequestResponseLoggerMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.time()
        path = request.path
        method = request.method
        cid = getattr(request, "correlation_id", get_correlation_id())
        try:
            response = self.get_response(request)
            duration_ms = int((time.time() - start) * 1000)
            logger.info(f"cid={cid} {method} {path} -> {getattr(response, 'status_code', '?')} in {duration_ms}ms")
            return response
        except Exception as exc:
            duration_ms = int((time.time() - start) * 1000)
            logger.exception(f"cid={cid} {method} {path} -> 500 in {duration_ms}ms: {exc}")
            raise